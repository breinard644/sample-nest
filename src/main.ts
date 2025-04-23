import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors();

  // 🔹 Swagger Config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // Add if you're using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI at /api

  const port = parseInt(process.env.PORT || process.env.APP_PORT || '3007', 10);
    await app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api`);
  });
}
bootstrap();
