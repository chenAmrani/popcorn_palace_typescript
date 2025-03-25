import { IsString, IsInt, IsNumber, Min, Max } from 'class-validator';
import { IsValidReleaseYear } from '../validators/release-year.validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @IsValidReleaseYear({ message: 'Release year cannot be in the future.' })
  release_year: number;
}
