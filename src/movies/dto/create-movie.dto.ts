import {
  IsString,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import {
  IsValidGenre,
  IsValidReleaseYear,
  NoLeadingSpace,
} from '../validators/release-year.validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  @NoLeadingSpace({ message: 'Title must not start with a space.' })
  title: string;

  @IsNotEmpty({ message: 'Genre is required.' })
  @IsString({ message: 'Genre must be a string.' })
  @IsValidGenre({ message: 'Genre must be one of the allowed types.' })
  genre: string;

  @IsNotEmpty({ message: 'Duration is required.' })
  @IsInt({ message: 'Duration must be an integer.' })
  @Min(1, { message: 'Duration must be at least 1 minute.' })
  @Max(300, { message: 'Duration cannot exceed 300 minutes.' })
  duration: number;

  @IsNotEmpty({ message: 'Rating is required.' })
  @IsNumber({}, { message: 'Rating must be a number.' })
  @Min(0, { message: 'Rating must be at least 0.' })
  @Max(10, { message: 'Rating cannot exceed 10.' })
  rating: number;

  @IsNotEmpty({ message: 'Release year is required.' })
  @IsInt({ message: 'Release year must be an integer.' })
  @IsValidReleaseYear({ message: 'Release year cannot be in the future.' })
  release_year: number;
}
