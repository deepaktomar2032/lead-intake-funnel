import { ConflictException, InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common'
import {
    Collection,
    CreateIndexesOptions,
    Db,
    Filter,
    FindOptions,
    IndexSpecification,
    InsertOneResult,
    MongoError,
    MongoServerError,
    OptionalUnlessRequiredId,
    UpdateFilter,
    UpdateResult,
    WithId
} from 'mongodb'

import { connectionHandler } from 'src/middlewares/connectionHandler.middleware'
import { DbEntry } from 'src/types/mongo.types'

export const DUPLICATE_KEY_ERROR_CODE: number = 11000

export interface FindOneOptions extends FindOptions {
    withProjection?: boolean
}

export interface UpdateResultWithId extends Omit<UpdateResult, 'upsertedId'> {
    upsertedId?: string
}

export interface InsertOneResultWithId extends Omit<InsertOneResult, 'insertedId'> {
    insertedId: string
}

export abstract class MongoService<T extends DbEntry> {
    private readonly logger: Logger = new Logger(MongoService.name)

    protected readonly defaultLimit: number = 1000
    protected readonly collectionName: string
    protected readonly entryProjection: object
    protected readonly dbConnectionRetriever: () => Db

    constructor(collectionName: string, dbConnectionRetriever: () => Db, projection: object = { _id: 1 }) {
        this.collectionName = collectionName
        this.entryProjection = projection
        this.dbConnectionRetriever = dbConnectionRetriever
    }

    public async collectionExists(collectionName: string = this.collectionName): Promise<boolean> {
        return !!(await this.dbConnectionRetriever()
            .listCollections({ name: collectionName }, { nameOnly: true })
            .next())
    }

    public async assertCollection(): Promise<Collection<T>> {
        const db: Db = this.dbConnectionRetriever()

        return (await this.collectionExists(this.collectionName))
            ? db.collection<T>(this.collectionName)
            : db.createCollection<T>(this.collectionName)
    }

    public async assertCollectionIndex(indexFields: IndexSpecification, options: CreateIndexesOptions): Promise<void> {
        try {
            const collection: Collection<T> = await this.assertCollection()

            if (!options.name) {
                this.logger.warn('MongoService:assertCollectionIndex: Missing index name')
                throw new InternalServerErrorException('Internal server error')
            }

            const indexExists: boolean = await collection.indexExists(options.name)
            if (!indexExists) {
                const createdIndexName: string = await collection.createIndex(indexFields, options)
                this.logger.log(
                    `MongoService:assertCollectionIndex: MongoDB: index ${createdIndexName} was asserted for collection ${this.collectionName}`
                )
            }
        } catch (dbErr) {
            const dbError: MongoError = dbErr as MongoError
            this.logAndBubble(dbError, { message: dbError.message })
            throw dbError
        }
    }

    public async findOne(
        query: Filter<T>,
        options: FindOneOptions = { withProjection: true }
    ): Promise<Omit<WithId<T>, '_id'> | undefined> {
        if (connectionHandler.isMongoDbDown()) {
            this.logger.error('MongoService:findOne: Could not connect to MongoDB')
            throw new ServiceUnavailableException('Service temporarily unavailable')
        }

        try {
            const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(this.collectionName)
            const entry: WithId<T> | null = await collection.findOne(query, options)

            return entry ? this.mapEntry(entry) : undefined
        } catch (error) {
            this.logAndBubble(error as Error, { query })
            throw error
        }
    }

    public async insertOne(doc: OptionalUnlessRequiredId<T>): Promise<InsertOneResultWithId> {
        if (connectionHandler.isMongoDbDown()) {
            this.logger.error('MongoService:insertOne: Could not connect to MongoDB')
            throw new ServiceUnavailableException('Service temporarily unavailable')
        }

        try {
            const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(this.collectionName)
            const now: Date = new Date()

            const result: InsertOneResult = await collection.insertOne({ ...doc, createdAt: now, updatedAt: now })

            return { ...result, insertedId: result.insertedId?.toString() }
        } catch (error) {
            this.logAndBubble(error as Error, { doc })
            throw error
        }
    }

    public async upsertEntry(
        query: Filter<T>,
        update?: UpdateFilter<T>
    ): Promise<{ entry?: T; updateResult: UpdateResultWithId }> {
        if (connectionHandler.isMongoDbDown()) {
            this.logger.error('MongoService:upsertEntry: Could not connect to MongoDB')
            throw new ServiceUnavailableException('Service temporarily unavailable')
        }

        try {
            const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(this.collectionName)
            const now: Date = new Date()

            const setter: Partial<T> = {
                ...(update || query),
                updatedAt: now
            } as unknown as Partial<T>

            const creationDate: Partial<T> = { createdAt: now } as unknown as T

            const updateFilter: UpdateFilter<T> = setter.createdAt
                ? ({ $set: setter } as unknown as UpdateFilter<T>)
                : ({ $set: setter, $setOnInsert: creationDate } as unknown as UpdateFilter<T>)

            const updateResult: UpdateResult = await collection.updateOne(query, updateFilter, {
                upsert: true
            })

            const updateResultWithId: UpdateResultWithId = {
                ...updateResult,
                upsertedId: updateResult.upsertedId?.toString()
            }

            if (updateResult.modifiedCount > 0) {
                const entry: WithId<T> | null = await collection.findOne(query)

                return entry
                    ? ({ entry: this.mapEntry(entry) as unknown as T, updateResult: updateResultWithId } as {
                          entry?: T
                          updateResult: UpdateResultWithId
                      })
                    : { updateResult: updateResultWithId }
            } else {
                return { updateResult: updateResultWithId }
            }
        } catch (error) {
            this.logAndBubble(error as Error, { query, update })
            throw error
        }
    }

    private mapEntry(entry: WithId<T>): Omit<WithId<T>, '_id'> & { id: string } {
        const { _id, ...rest } = entry
        const id: string | undefined = _id?.toString()
        if (!id) {
            this.logger.error('MongoService:mapEntry: Missing _id on MongoDB entry')
            throw new InternalServerErrorException('Internal server error')
        }
        return { id, ...rest }
    }

    private logAndBubble(error: Error, additionalInfo?: object) {
        if (error instanceof MongoServerError) {
            const err: MongoServerError = error
            if (err.name === 'MongoServerError' && err.code === DUPLICATE_KEY_ERROR_CODE) {
                this.logger.warn('MongoService:logAndBubble: Duplicate key error', { meta: { ...additionalInfo } })
                throw new ConflictException('Duplicate resource')
            }
        }
        this.logger.log('MongoService:logAndBubble adapter info', { meta: { ...additionalInfo } })
        throw new InternalServerErrorException('Internal server error')
    }
}
