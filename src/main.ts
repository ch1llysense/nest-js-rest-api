import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create an instance of the Nest application
  const app = await NestFactory.create(AppModule, { cors: {} });

  // Enable CORS for the application, allowing requests from 'http://localhost:3000' origin
  app.enableCors({ origin: 'http://localhost:3000', allowedHeaders: '*' });

  // Configure a global validation pipe to whitelist incoming data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Start listening on port 4000
  await app.listen(4000);
}

// Call the bootstrap function to start the application
bootstrap();
