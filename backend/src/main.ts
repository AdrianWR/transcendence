import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // OpenApi setup
  const documentOptions = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('Transcendence Backend')
    .setVersion('1.0')
    .addTag('transcendence')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api', app, document);

  // Setupcookie parser
  app.use(cookieParser());

  // Deploy app
  const config = app.get(ConfigService)
  const port = config.getOrThrow("APP_PORT")
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  await app.listen(port);
}
bootstrap();