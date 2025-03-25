import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsPositive, IsDate } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  @IsPositive({ message: 'Movie ID must be a positive number.' })
  movieId: number;

  @IsString({ message: 'Theater name must be a string.' })
  theater: string;

  @IsDate({ message: 'start_time must be a valid date object.' })
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @IsDate({ message: 'end_time must be a valid date object.' })
  @Transform(({ value }) => new Date(value))
  end_time: Date;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number.' })
  price: number;
}
