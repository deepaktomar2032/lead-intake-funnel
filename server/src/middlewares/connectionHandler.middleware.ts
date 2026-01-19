import { Injectable, Logger, NestMiddleware, ServiceUnavailableException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

export interface ConnectionStatus {
    isMongoDbDown: boolean
    isServiceInitialized: boolean
}

@Injectable()
export class ConnectionHandlerMiddleware implements NestMiddleware {
    private readonly logger: Logger = new Logger(ConnectionHandlerMiddleware.name)
    private static isServiceInitialized: boolean = false
    private static isMongoDbDown: boolean = false

    public readonly use = (_req: Request, _res: Response, next: NextFunction) => {
        if (this.isServiceDown()) {
            throw new ServiceUnavailableException('Service is not initialized')
        }
        next()
    }

    public isServiceDown() {
        return !ConnectionHandlerMiddleware.isServiceInitialized
    }

    public isMongoDbDown() {
        return ConnectionHandlerMiddleware.isMongoDbDown
    }

    public updateServiceStatus(isServiceInitialized: boolean) {
        ConnectionHandlerMiddleware.isServiceInitialized = isServiceInitialized
    }

    public updateMongoDbStatus(isMongoDbDown: boolean) {
        ConnectionHandlerMiddleware.isMongoDbDown = isMongoDbDown
    }

    public getStatus(): ConnectionStatus {
        return {
            isMongoDbDown: ConnectionHandlerMiddleware.isMongoDbDown,
            isServiceInitialized: ConnectionHandlerMiddleware.isServiceInitialized
        }
    }
}
export const connectionHandler: ConnectionHandlerMiddleware = new ConnectionHandlerMiddleware()
