import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { } from 'class-validator';
import {} from 'class-transformer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
