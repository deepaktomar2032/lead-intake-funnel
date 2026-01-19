import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { AppModule } from './app.module'

const logger: Logger = new Logger('Bootstrap Module')

async function bootstrap() {
    try {
        const app: INestApplication = await NestFactory.create(AppModule)
        app.setGlobalPrefix('api')

        app.enableCors({
            origin: true,
            methods: ['POST', 'PUT'],
            allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
            credentials: false
        })

        // Helmet Security headers
        app.use(helmet({ contentSecurityPolicy: false }))

        const PORT: number = parseInt(process.env.PORT || '3000', 10)

        await app.listen(PORT, '0.0.0.0')

        logger.log(`Server is up & running on Port: ${PORT}`)
        logger.log(`API is ready to use: http://localhost:${PORT}`)
    } catch (error: unknown) {
        logger.error('Error during application bootstrap', error)
        process.exit(1)
    }
}

bootstrap()
