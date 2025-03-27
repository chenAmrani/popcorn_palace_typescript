import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { clearDatabase, createTestApp } from './setup';

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
    await clearDatabase(app);
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
    app = await createTestApp();
    await app.close();
  });

  it('/movies (POST) - Attempt to create a movie without release year', async () => {
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
        expect(res.body.message).toContain('Release year is required.');
      });
  });

  it('/movies (GET) - Return all movies', () => {
    return request(app.getHttpServer())
      .get('/movies/all')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
      });
  });

  it('/movies/:id (GET) - Return a specific movie by ID', async () => {
    return request(app.getHttpServer())
      .get(`/movies/${movie2Id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(movie2Id);
      });
  });

  it('/movies/:title (DELETE) - Delete a movie by Title', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/movies/${movie1Title}`)
      .expect(200);

    expect(res.body).toEqual({
      message: `Movie with title "${testMovieByTitle.title}" was deleted successfully.`,
    });
  });

  it('/movies/id/:id (DELETE) - Delete a movie by ID', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/movies/id/${movie2Id}`)
      .expect(200);

    expect(res.body).toEqual({
      message: `Movie with ID "${movie2Id}" was deleted successfully.`,
    });
  });

  it('/movies/id/:id (DELETE) - Attempt to delete non-existent movie', async () => {
    await request(app.getHttpServer())
      .delete(`/movies/id/9999`)
      .expect(404)
      .expect({
        message: 'Movie with ID "9999" not found.',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('/movies (POST) - Attempt to create a movie with future release year', async () => {
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
      .expect((res) => {
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
        expect(res.body.message).toContain(
          `Movie "${duplicateMovie.title}" (${duplicateMovie.release_year}) already exists.`,
        );
      });
  });

  it('/movies/:id (GET) - Non-existent movie ID returns 404', async () => {
    await request(app.getHttpServer())
      .get('/movies/999999')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Movie with ID "999999" not found.');
      });
  });

  it('/movies/update/:title (PUT) - Update movie by title', async () => {
    const movie = {
      title: 'UpdateTitleMovie',
      genre: 'Horror',
      duration: 90,
      rating: 3.5,
      release_year: 2020,
    };

    await request(app.getHttpServer()).post('/movies').send(movie).expect(201);

    await request(app.getHttpServer())
      .put(`/movies/update/${movie.title}`)
      .send({ rating: 4.7 })
      .expect(200)
      .expect((res) => {
        expect(res.body.rating).toBe(4.7);
      });
  });

  it('/movies/update/id/:id (PUT) - Update movie by ID', async () => {
    const movie = {
      title: 'UpdateIdMovie',
      genre: 'Comedy',
      duration: 100,
      rating: 4.0,
      release_year: 2019,
    };

    const res = await request(app.getHttpServer())
      .post('/movies')
      .send(movie)
      .expect(201);

    const id = res.body.id;

    await request(app.getHttpServer())
      .put(`/movies/update/id/${id}`)
      .send({ genre: 'Romance' })
      .expect(200)
      .expect((res) => {
        expect(res.body.genre).toBe('Romance');
      });
  });

  it('/movies/update/:title (PUT) - Attempt to update non-existent movie by title', async () => {
    await request(app.getHttpServer())
      .put('/movies/update/NonExistentTitle')
      .send({ genre: 'Sci-Fi' })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe(
          'Movie with title "NonExistentTitle" not found.',
        );
      });
  });

  it('/movies/update/id/:id (PUT) - Attempt to update non-existent movie by ID', async () => {
    await request(app.getHttpServer())
      .put('/movies/update/id/999999')
      .send({
        title: 'Inception',
        genre: 'Drama',
        duration: 148,
        rating: 8.8,
        release_year: 2010,
      })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Movie with ID "999999" not found.');
      });
  });

  it('/movies/update/id/:id (PUT) - Attempt to update movie title to a duplicate', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'OriginalTitleA',
        genre: 'Action',
        duration: 100,
        rating: 4,
        release_year: 2022,
      })
      .expect(201);

    const movieB = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'OriginalTitleB',
        genre: 'Thriller',
        duration: 110,
        rating: 3.9,
        release_year: 2022,
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/movies/update/id/${movieB.body.id}`)
      .send({ title: 'OriginalTitleA' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          `Movie "OriginalTitleA" (2022) already exists.`,
        );
      });
  });

  it('/movies (POST) - Attempt to create movie without title', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .send({
        genre: 'Drama',
        duration: 90,
        rating: 4.2,
        release_year: 2021,
      })
      .expect(400)
      .expect((res) => {
        expect(
          res.body.message.some((msg) => msg.includes('Title is required')),
        ).toBe(true);
      });
  });

  it('/movies (POST) - Attempt to create movie with invalid rating', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'InvalidRatingMovie',
        genre: 'Sci-Fi',
        duration: 100,
        rating: 11,
        release_year: 2023,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'rating must not be greater than 10.',
        );
      });
  });

  it('/movies (POST) - Attempt to create movie with negative duration', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'NegativeDurationMovie',
        genre: 'Mystery',
        duration: -90,
        rating: 3.8,
        release_year: 2023,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'Duration must be at least 1 minute.',
        );
      });
  });
});
