import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsPositive({ message: 'Showtime ID must be a positive number.' })
  showtimeId: number;

  @IsString({ message: 'User ID must be a string.' })
  userId: string;

  @IsNumber()
  @IsPositive({ message: 'Seat number must be a positive number.' })
  seatNumber: number;
}
