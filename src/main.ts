import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const runNestApplication = async (
    configService: ConfigService,
): Promise<void> => {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        bodyParser: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: false,
            whitelist: true,
            transform: true,
        }),
    );
    const swaggerConfigs = new DocumentBuilder()
        .setTitle('Films API')
        .setDescription('Films description REST API')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfigs);
    SwaggerModule.setup('api/docs', app, document);
    const port = configService.get<number>('PORT');
    await app.listen(port ?? 3001);
    Logger.log(`Application started on ${await app.getUrl()}`);
};

void runNestApplication(new ConfigService());
