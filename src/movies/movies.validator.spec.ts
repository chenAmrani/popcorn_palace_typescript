import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  IsValidGenre,
  IsValidReleaseYear,
  NoLeadingSpace,
} from './validators/movie.validator';

class MovieDto {
  @IsValidReleaseYear()
  release_year: number;

  @IsValidGenre()
  genre: string;

  @NoLeadingSpace()
  title: string;
}

describe('Movie Validator Decorators', () => {
  it('should validate release year is not in the future', async () => {
    const currentYear = new Date().getFullYear();
    const movie = plainToInstance(MovieDto, {
      release_year: currentYear,
      genre: 'Action',
      title: 'ValidTitle',
    });

    let errors = await validate(movie);
    expect(errors.length).toBe(0);

    movie.release_year = currentYear + 1;
    errors = await validate(movie);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsValidReleaseYear).toBe(
      'Release year cannot be in the future.',
    );
  });

  it('should validate allowed genres', async () => {
    const movie = plainToInstance(MovieDto, {
      release_year: 2022,
      genre: 'Comedy',
      title: 'ValidTitle',
    });

    let errors = await validate(movie);
    expect(errors.length).toBe(0);

    movie.genre = 'UnknownGenre';
    errors = await validate(movie);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsValidGenre).toBe(
      'UnknownGenre is not a valid genre.',
    );
  });

  it('should validate no leading space in title', async () => {
    const movie = plainToInstance(MovieDto, {
      release_year: 2022,
      genre: 'Horror',
      title: 'ValidTitle',
    });

    let errors = await validate(movie);
    expect(errors.length).toBe(0);

    movie.title = ' InvalidTitle';
    errors = await validate(movie);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.NoLeadingSpace).toBe(
      'title must not start with a space.',
    );
  });
});
