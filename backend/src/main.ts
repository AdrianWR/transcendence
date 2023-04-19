import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // OpenApi setup
  const documentOptions = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('Transcendence Backend API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('docs', app, document);

  // Setup CORS options
  //app.enableCors();

  const allowList = [config.get('FRONTEND_URL')];
  app.enableCors({
    origin: allowList,
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'UPDATE', 'OPTIONS'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'Authorization',
      'Origin',
    ],
  });

  // Setup cookie parser
  app.use(cookieParser());

  // Setup validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Deploy app
  const port = config.getOrThrow('APP_PORT');
  await app.listen(port);
}
bootstrap();
