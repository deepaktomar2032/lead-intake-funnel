import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger: Logger = new Logger(LoggerMiddleware.name)

    public readonly use = (req: Request, res: Response, next: NextFunction) => {
        this.logger.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
        next()
    }
}
