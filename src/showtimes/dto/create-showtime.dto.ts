import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty({ message: 'movieId is required.' })
  @IsNumber()
  @IsPositive({ message: 'movieId must be a positive number.' })
  movieId: number;

  @IsNotEmpty({ message: 'theater is required.' })
  @IsString({ message: 'theater must be a string.' })
  theater: string;

  @IsNotEmpty({ message: 'start_time is required.' })
  @IsDate({ message: 'start_time must be a valid date object' })
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @IsNotEmpty({ message: 'end_time is required.' })
  @IsDate({ message: 'end_time must be a valid date object' })
  @Transform(({ value }) => new Date(value))
  end_time: Date;

  @IsNotEmpty({ message: 'price is required.' })
  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number.' })
  price: number;
}
