import { Injectable, Logger, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from '@nestjs/common'
import { ClientSession, Db, MongoClient } from 'mongodb'

import { connectionHandler } from 'src/middlewares/connectionHandler.middleware'

@Injectable()
export class MongoConnectionService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: Logger = new Logger(MongoConnectionService.name)

    private client: MongoClient | null = null
    private db: Db | null = null
    private session: ClientSession | null = null

    private readyResolve: (() => void) | null = null
    private readyReject: ((err: Error) => void) | null = null
    private readonly readyPromise: Promise<void>

    public constructor() {
        this.readyPromise = new Promise<void>((resolve, reject) => {
            this.readyResolve = resolve
            this.readyReject = reject
        })
    }

    public async onModuleInit(): Promise<void> {
        await this.connect()
    }

    public async onModuleDestroy(): Promise<void> {
        try {
            await this.session?.endSession()
            await this.client?.close()
        } catch (error) {
            this.logger.warn(
                'MongoConnectionService:onModuleDestroy: Error while closing MongoDB connection',
                this.toError(error)
            )
        }
    }

    public async connect(): Promise<void> {
        const defaultConnectionTimeout: number = 30000

        try {
            const dbName: string = process.env.MONGODB_DATABASE_NAME || 'heatos_sales_dev'
            const mongoUri: string | undefined = process.env.MONGODB_URI

            if (!mongoUri) {
                this.logger.error('MongoConnectionService:connect: Missing MongoDB connection configuration')
                throw new ServiceUnavailableException('Service temporarily unavailable')
            }

            this.client = new MongoClient(mongoUri, {
                connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUTMS) || defaultConnectionTimeout
            })

            let serverHeartbeatFailed: number = 0
            let wasReconnected: boolean = false

            const logInfoAndContinue: () => void = (): void => {
                this.logger.log('MongoDB connection regained')
                wasReconnected = true
                serverHeartbeatFailed = 0
                connectionHandler.updateMongoDbStatus(false)
            }

            this.client.on('serverHeartbeatFailed', () => {
                this.logger.warn('MongoDB connection lost')
                serverHeartbeatFailed += 1
                wasReconnected = false

                connectionHandler.updateMongoDbStatus(true)

                if (!wasReconnected) {
                    this.logger.error(`MongoDB Connection Error - retry: ${serverHeartbeatFailed}`)
                }

                this.client?.once('serverHeartbeatSucceeded', logInfoAndContinue)
            })

            await this.client.connect()

            this.db = this.client.db(dbName)
            this.session = this.client.startSession()

            connectionHandler.updateMongoDbStatus(false)
            this.readyResolve?.()

            this.logger.log('MongoDB initialized connection')
        } catch (error) {
            connectionHandler.updateMongoDbStatus(true)
            const err: Error = this.toError(error)
            this.readyReject?.(err)
            this.logger.error('MongoConnectionService:connect: MongoDB Connection Error', err)
            throw new ServiceUnavailableException('Service temporarily unavailable', { cause: err })
        }
    }

    public getDb(): Db {
        if (!this.db) {
            this.logger.error('MongoConnectionService:getDb: MongoDB is not connected yet')
            throw new ServiceUnavailableException('Service temporarily unavailable')
        }
        return this.db
    }

    public whenReady(): Promise<void> {
        return this.readyPromise
    }

    private toError(error: unknown): Error {
        return error instanceof Error ? error : new Error(String(error))
    }
}
