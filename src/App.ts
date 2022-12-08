import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export class App {
    private readonly application: INestApplication;
    private readonly config: ConfigService;
    private readonly logger: Logger;
    private readonly serverPort: number;

    constructor(application: INestApplication) {
        this.application = application;
        this.config = this.application.get(ConfigService);
        this.serverPort = +this.config.get<number>('SERVER_PORT');
        this.logger = new Logger(App.name);
        this.buildDocumentation();
    }

    static async initialize(): Promise<App> {
        const app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter(),
            {
                cors: true,
                bodyParser: true,
            },
        );
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                disableErrorMessages: false,
                whitelist: true,
                transform: true,
            }),
        );
        return new App(app);
    }

    private buildDocumentation(): void {
        const swaggerBaseConfigs = new DocumentBuilder()
            .setTitle('Films API')
            .setDescription('Films description REST API')
            .setVersion('1.0.0')
            .build();

        const document = SwaggerModule.createDocument(
            this.application,
            swaggerBaseConfigs,
        );
        SwaggerModule.setup('/api/docs', this.application, document);
    }

    async listen(): Promise<void> {
        this.application
            .listen(this.serverPort, '0.0.0.0', async () => {
                this.logger
                    .log(`Application documentation is available at ${await this.application.getUrl()}/api/docs
            `);
            })
            .catch(this.logger.error);
    }
}
