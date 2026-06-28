import {NestFactory, Reflector} from '@nestjs/core';
import {ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {AllExceptionsFilter} from '@exceptions';
import {ResponseHttpInterceptor} from '@interceptors';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import * as process from 'process';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 422,
            stopAtFirstError: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new ResponseHttpInterceptor());

    // app.useGlobalFilters(new AllExceptionsFilter());

    app.setGlobalPrefix('api/v1');

    app.useStaticAssets(join(process.cwd(), 'assets'));

    const documentBuilder = new DocumentBuilder().setTitle('API SIAAW')
        .setDescription('App Description')
        .setVersion('3')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);

    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
