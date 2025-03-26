import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

export async function createTestApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );
  return app;
}
