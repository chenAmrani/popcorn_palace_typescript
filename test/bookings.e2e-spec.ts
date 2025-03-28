import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { clearDatabase, createTestApp } from './setup';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
    await clearDatabase(app);
    await app.init();
  });

  afterEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await clearDatabase(app);
    await app.close();
  });

  const createMovieAndShowtime = async (): Promise<number> => {
    const moviePayload = {
      title: Math.random().toString(),
      genre: 'Drama',
      duration: 120,
      rating: 4,
      release_year: 2022,
    };

    const movieRes = await request(app.getHttpServer())
      .post('/movies')
      .send(moviePayload);

    if (movieRes.status !== 201) {
      throw new Error('Movie creation failed');
    }

    const movieId = movieRes.body.id;

    const showtimePayload = {
      movieId,
      theater: 'Test Theater',
      start_time: '2030-01-01T18:00:00.000Z',
      end_time: '2030-01-01T20:00:00.000Z',
      price: 50,
    };

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send(showtimePayload);

    if (showtimeRes.status !== 201) {
      throw new Error('Showtime creation failed');
    }

    return showtimeRes.body.id;
  };

  it('POST /bookings - create valid booking', async () => {
    const showtimeId = await createMovieAndShowtime();
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 1, userId: 'user123' })
      .expect(201);
    expect(res.body.seatNumber).toBe(1);
  });

  it('GET /bookings - should return list of bookings', async () => {
    const showtimeId = await createMovieAndShowtime();
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 2, userId: 'userA' });

    const res = await request(app.getHttpServer()).get('/bookings').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /bookings/:id - get booking by id', async () => {
    const showtimeId = await createMovieAndShowtime();
    const createRes = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 3, userId: 'userB' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/bookings/${createRes.body.id}`)
      .expect(200);
    expect(res.body.id).toBe(createRes.body.id);
  });

  it('GET /bookings/:id - not found', async () => {
    await request(app.getHttpServer()).get('/bookings/99999').expect(404);
  });

  it('DELETE /bookings/:id - delete booking', async () => {
    const showtimeId = await createMovieAndShowtime();
    const createRes = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 4, userId: 'userC' });

    const res = await request(app.getHttpServer())
      .delete(`/bookings/${createRes.body.id}`)
      .expect(200);
    expect(res.body.message).toBe(
      `Booking with ID ${createRes.body.id} was deleted successfully.`,
    );
  });

  it('DELETE /bookings/:id - not found', async () => {
    await request(app.getHttpServer()).delete('/bookings/99999').expect(404);
  });

  it('POST /bookings - seat already booked', async () => {
    const showtimeId = await createMovieAndShowtime();
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 5, userId: 'userD' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 5, userId: 'userE' })
      .expect(400);
  });

  it('POST /bookings - showtime does not exist', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: 999999,
        seatNumber: 10,
        userId: 'user123',
      })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toContain(
          'Showtime with ID 999999 does not exist.',
        );
      });
  });

  it('POST /bookings - missing seat number', async () => {
    const showtimeId = await createMovieAndShowtime();
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, userId: 'userG' })
      .expect(400);
  });

  it('POST /bookings - invalid seat number (0)', async () => {
    const showtimeId = await createMovieAndShowtime();
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 0, userId: 'userH' })
      .expect(400);
  });

  it('POST /bookings - seat number too high', async () => {
    const showtimeId = await createMovieAndShowtime();
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 101, userId: 'userI' })
      .expect(400);
  });

  it('POST /bookings - missing userId', async () => {
    const showtimeId = await createMovieAndShowtime();
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 7 })
      .expect(400);
  });

  it('PUT /bookings/:id - update seat number successfully', async () => {
    const movieRes = await request(app.getHttpServer()).post('/movies').send({
      title: 'UpdateBookingMovie',
      genre: 'Action',
      duration: 120,
      rating: 4,
      release_year: 2022,
    });

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieRes.body.id,
        theater: 'Theater1',
        start_time: '2030-01-01T10:00:00.000Z',
        end_time: '2030-01-01T12:00:00.000Z',
        price: 50,
      });

    const bookingRes = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: showtimeRes.body.id,
        seatNumber: 10,
        userId: 'updateUser',
      });

    const updated = await request(app.getHttpServer())
      .put(`/bookings/${bookingRes.body.id}`)
      .send({ seatNumber: 11 })
      .expect(200);

    expect(updated.body.seatNumber).toBe(11);
  });

  it('DELETE /movies/:id - deleting a movie should also delete its showtimes and bookings', async () => {
    const movieRes = await request(app.getHttpServer()).post('/movies').send({
      title: 'CascadeMovie',
      genre: 'Thriller',
      duration: 100,
      rating: 3.9,
      release_year: 2023,
    });

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieRes.body.id,
        theater: 'Cascade Theater',
        start_time: '2031-01-01T14:00:00.000Z',
        end_time: '2031-01-01T16:00:00.000Z',
        price: 60,
      });

    const bookingRes = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: showtimeRes.body.id,
        seatNumber: 15,
        userId: 'cascadeUser',
      });

    await request(app.getHttpServer())
      .delete(`/movies/id/${movieRes.body.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Movie with ID ${movieRes.body.id} was deleted successfully.`,
        );
      });

    await request(app.getHttpServer())
      .get(`/showtimes/${showtimeRes.body.id}`)
      .expect(404);
    await request(app.getHttpServer())
      .get(`/bookings/${bookingRes.body.id}`)
      .expect(404);
  });
});
