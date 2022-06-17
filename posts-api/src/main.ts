import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import listEndpoints from 'express-list-endpoints';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);

  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(listEndpoints(router));
}

bootstrap();
