import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ShowtimesController (e2e)', () => {
  let app: INestApplication;
  let createdShowtimeId: number;
  let movieIdTest: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const movieRes = await request(app.getHttpServer()).post('/movies').send({
      title: 'Test Movie',
      description: 'A movie created for testing',
      duration: 120,
      genre: 'Action',
      rating: 5,
      release_year: 2025,
    });

    movieIdTest = movieRes.body.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/movies/${movieIdTest}`);
    await request(app.getHttpServer()).delete(
      `/showtimes/${createdShowtimeId}`,
    );
    await app.close();
  });

  it('POST /showtimes - invalid date format', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Bad Date Theater',
        start_time: 'invalid-date',
        end_time: '2025-04-01T20:00:00.000Z',
        price: 40,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'start_time or end_time is not a valid ISO date.',
        );
      });
  });

  it('POST /showtimes - negative price', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Negative Price Theater',
        start_time: '2025-05-01T10:00:00.000Z',
        end_time: '2025-05-01T12:00:00.000Z',
        price: -10,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('Price must be a positive number.');
      });
  });

  it('POST /showtimes - non-existent movieId', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: 9999,
        theater: 'Nonexistent Movie Theater',
        start_time: '2025-06-01T10:00:00.000Z',
        end_time: '2025-06-01T12:00:00.000Z',
        price: 50,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'Movie with ID 9999 does not exist.',
        );
      });
  });

  it('POST /showtimes - create a valid showtime', async () => {
    const res = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Cinema City',
        start_time: '2025-08-01T10:00:00.000Z',
        end_time: '2025-08-01T12:00:00.000Z',
        price: 60,
      })
      .expect(201);

    createdShowtimeId = res.body.id;
    expect(res.body).toHaveProperty('id');
    expect(res.body.theater).toBe('Cinema City');
  });

  it('POST /showtimes - exact overlapping time on same theater => should fail', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Cinema City',
        start_time: '2025-08-01T19:00:00.000Z',
        end_time: '2025-08-01T21:00:00.000Z',
        price: 70,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('overlaps with the selected time');
      });
  });

  it('POST /showtimes - partial overlap at start => should fail', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Cinema City',
        start_time: '2025-08-01T11:00:00.000Z',
        end_time: '2025-08-01T12:00:00.000Z',
        price: 60,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('overlaps with the selected time');
      });
  });

  it('PUT /showtimes/update/:id - attempt to update into overlapping time => should fail', async () => {
    await request(app.getHttpServer())
      .put(`/showtimes/update/${createdShowtimeId}`)
      .send({
        start_time: '2025-08-01T19:00:00.000Z',
        end_time: '2025-08-01T21:00:00.000Z',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('overlaps with the selected time');
      });
  });

  it('POST /showtimes - overlapping time but different theater => should succeed', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Yes Planet',
        start_time: '2025-08-01T19:00:00.000Z',
        end_time: '2025-08-01T21:00:00.000Z',
        price: 70,
      })
      .expect(201);
  });

  it('GET /showtimes/all - return all showtimes', async () => {
    const res = await request(app.getHttpServer())
      .get('/showtimes/all')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /showtimes/:id - return a specific showtime', async () => {
    const res = await request(app.getHttpServer())
      .get(`/showtimes/${createdShowtimeId}`)
      .expect(200);

    expect(res.body.id).toBe(createdShowtimeId);
  });

  it('PUT /showtimes/update/:id - update showtime price', async () => {
    const res = await request(app.getHttpServer())
      .put(`/showtimes/update/${createdShowtimeId}`)
      .send({ price: 100 })
      .expect(200);

    expect(res.body.price).toBe(100);
  });

  it('PUT /showtimes/update/:id - invalid new time range', async () => {
    await request(app.getHttpServer())
      .put(`/showtimes/update/${createdShowtimeId}`)
      .send({
        start_time: '2025-08-01T21:00:00.000Z',
        end_time: '2025-08-01T20:00:00.000Z',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('End time must be after start time.');
      });
  });

  it('GET /showtimes/bookings - returns all showtimes with booking count', async () => {
    await request(app.getHttpServer()).get('/showtimes/bookings').expect(200);
  });

  it('POST /showtimes - missing theater field should fail', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        start_time: '2025-07-01T10:00:00.000Z',
        end_time: '2025-07-01T12:00:00.000Z',
        price: 50,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('theater is required');
      });
  });

  it('PUT /showtimes/update/:id - invalid date format on update', async () => {
    await request(app.getHttpServer())
      .put(`/showtimes/update/${createdShowtimeId}`)
      .send({ start_time: 'not-a-real-date-string' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'start_time or end_time is not a valid ISO date.',
        );
      });
  });

  it('POST /showtimes - start time in the past should fail', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieIdTest,
        theater: 'Old Date Theater',
        start_time: '2020-01-01T10:00:00.000Z',
        end_time: '2020-01-01T12:00:00.000Z',
        price: 50,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Start time must be in the future.');
      });
  });

  it('DELETE /showtimes/:id - delete showtime', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/showtimes/${createdShowtimeId}`)
      .expect(200);

    expect(res.body.message).toContain('was deleted successfully');
  });

  it('GET /showtimes/:id - get deleted showtime returns 404', async () => {
    await request(app.getHttpServer())
      .get(`/showtimes/${createdShowtimeId}`)
      .expect(404);
  });

  it('DELETE /showtimes/:id - delete non-existent showtime returns 404', async () => {
    await request(app.getHttpServer())
      .delete(`/showtimes/${createdShowtimeId}`)
      .expect(404);
  });
});
