import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  let createdShowtimeId: number;
  let bookingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const showtimeResponse = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: 1,
        theater: 'Test Theater',
        start_time: '2030-01-01T18:00:00.000Z',
        end_time: '2030-01-01T20:00:00.000Z',
        price: 50,
      });
    createdShowtimeId = showtimeResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /bookings - create booking', async () => {
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId: createdShowtimeId, seatNumber: 1, userId: 'e2eUser' })
      .expect(201);

    bookingId = res.body.id;
    expect(res.body.seatNumber).toBe(1);
  });

  it('GET /bookings - get all bookings', async () => {
    const res = await request(app.getHttpServer()).get('/bookings').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /bookings/:id - get booking by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/bookings/${bookingId}`)
      .expect(200);
    expect(res.body.id).toBe(bookingId);
  });

  it('DELETE /bookings/:id - delete booking', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/bookings/${bookingId}`)
      .expect(200);
    expect(res.body.message).toContain('was deleted successfully');
  });

  it('POST /bookings - seat already booked', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId: createdShowtimeId, seatNumber: 2, userId: 'userA' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId: createdShowtimeId, seatNumber: 2, userId: 'userB' })
      .expect(400);
  });
});
