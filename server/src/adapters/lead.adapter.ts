import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Db } from 'mongodb'

import { MongoService } from 'src/database/database.service'
import { MongoConnectionService } from 'src/database/mongoConnection.service'
import { LeadEntry } from 'src/types/leadEntry.types'

@Injectable()
export class LeadAdapter<T extends LeadEntry> extends MongoService<T> implements OnModuleInit {
    private readonly leadLogger: Logger = new Logger(LeadAdapter.name)

    constructor(private readonly mongoConnection: MongoConnectionService) {
        super('leadEntries', () => mongoConnection.getDb())
    }

    public async onModuleInit(): Promise<void> {
        try {
            await this.mongoConnection.whenReady()
            await this.update(true, this.mongoConnection.getDb())
        } catch (error: unknown) {
            this.leadLogger.error('LeadAdapter:onModuleInit: ', error)
        }
    }

    public async update(isConnected: boolean, db: Db): Promise<void> {
        if (isConnected && db) {
            try {
                await this.assertCollectionIndex({ createdAt: -1 }, { name: 'createdAt_desc' })
            } catch (error: unknown) {
                this.leadLogger.error('LeadAdapter:update: ', error)
            }
        }
    }
}
