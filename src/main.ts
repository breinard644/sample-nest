import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use cookie-parser middleware
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors({});
  
  const config = new DocumentBuilder()
  .setTitle('API')
  .setDescription('My API Description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token', // 👈 this name must match @ApiBearerAuth
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.APP_CONTAINER_PORT || process.env.APP_HOST_PORT || '3007', 10);
    await app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api`);
  });
}
bootstrap();

