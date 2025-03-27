import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function clearDatabase(app: INestApplication) {
  const dataSource = app.get(DataSource);

  await dataSource.query('TRUNCATE TABLE bookings RESTART IDENTITY CASCADE');
  await dataSource.query('TRUNCATE TABLE showtimes RESTART IDENTITY CASCADE');
  await dataSource.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE');
}

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
