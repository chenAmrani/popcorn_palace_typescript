import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './setup';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let movie1Title: string;
  let movie2Id: number;

  const movieIds: number[] = [];

  const testMovieByTitle = {
    title: 'movie1',
    genre: 'Action',
    duration: 120,
    rating: 4.5,
    release_year: 2023,
  };

  const testMovieById = {
    title: 'movie2',
    genre: 'Drama',
    duration: 140,
    rating: 4.8,
    release_year: 2024,
  };

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();

    const res1 = await request(app.getHttpServer())
      .post('/movies')
      .send(testMovieByTitle)
      .expect(201);

    movie1Title = res1.body.title;
    movieIds.push(res1.body.id);

    const res2 = await request(app.getHttpServer())
      .post('/movies')
      .send(testMovieById)
      .expect(201);
    movie2Id = res2.body.id;
    movieIds.push(res2.body.id);
  });

  afterAll(async () => {
    for (const id of movieIds) {
      await request(app.getHttpServer()).delete(`/movies/id/${id}`).expect(200);
    }

    await app.close();
  });

  it.skip('/movies (POST) - Attempt to create a movie without release year', async () => {
    const futureYearMovie = {
      title: Math.random().toString(),
      genre: 'Sci-Fi',
      duration: 150,
      rating: 4.2,
    };

    await request(app.getHttpServer())
      .post('/movies')
      .send(futureYearMovie)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'null value in column "release_year" of relation "movies" violates not-null constraint',
        );
      });
  });

  it.skip('/movies (GET) - Return all movies', () => {
    return request(app.getHttpServer())
      .get('/movies/all')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
      });
  });

  it.skip('/movies/:id (GET) - Return a specific movie by ID', async () => {
    return request(app.getHttpServer())
      .get(`/movies/${movie2Id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(movie2Id);
      });
  });

  it.skip('/movies/:title (DELETE) - Delete a movie by Title', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/movies/${movie1Title}`)
      .expect(200);

    expect(res.body).toEqual({
      message: `Movie with title "${testMovieByTitle.title}" was deleted successfully.`,
    });
  });

  it.skip('/movies/id/:id (DELETE) - Delete a movie by ID', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/movies/id/${movie2Id}`)
      .expect(200);

    expect(res.body).toEqual({
      message: `Movie with ID "${movie2Id}" was deleted successfully.`,
    });
  });

  it.skip('/movies/id/:id (DELETE) - Attempt to delete non-existent movie', async () => {
    await request(app.getHttpServer())
      .delete(`/movies/id/9999`)
      .expect(404)
      .expect({
        message: 'Movie with ID "9999" not found.',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it.only('/movies (POST) - Attempt to create a movie with future release year', async () => {
    const futureYearMovie = {
      title: Math.random().toString(),
      genre: 'Sci-Fi2',
      duration: 150,
      rating: 4.2,
      release_year: new Date().getFullYear() + 1,
    };

    await request(app.getHttpServer())
      .post('/movies')
      .send(futureYearMovie)
      // .expect(400)
      .expect((res) => {
        console.log('res.body', res.body);
        expect(res.body.message).toContain(
          'Release year cannot be in the future.',
        );
      });
  });

  it('/movies (POST) - Attempt to create a duplicate movie title', async () => {
    const duplicateMovie = {
      title: 'DuplicateMovie',
      genre: 'Thriller',
      duration: 100,
      rating: 4.0,
      release_year: 2022,
    };

    await request(app.getHttpServer())
      .post('/movies')
      .send(duplicateMovie)
      .expect(201);

    await request(app.getHttpServer())
      .post('/movies')
      .send(duplicateMovie)
      .expect(400)
      .expect((res) => {
        console.log('Error Response:', res.body);
        expect(res.body.message).toContain(
          `Movie with title "${duplicateMovie.title}" already exists.`,
        );
      });
  });
});
