import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { HttpExceptionFilter } from './common/filters/http-exception';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Silent Auction API')
    .setDescription('API for mobile app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

    // Serve static files (for uploaded images)
const express = require('express');
app.enableCors();
 const uploadsPath = path.join(process.cwd(), 'uploads');
 app.use('/uploads', express.static(uploadsPath));
  SwaggerModule.setup('api', app, document);

  console.log(process.cwd())
  console.log(__dirname)

  // Optional: Global JWT guard
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ validateCustomDecorators: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();




