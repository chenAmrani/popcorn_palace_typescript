import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  validateSeatNumber,
  validateUserId,
  validateUniqueSeatNumber,
  validateShowtimeExists,
  validateBookingBeforeShowtimeEnds,
} from './validators/booking.validator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() bookingData: CreateBookingDto) {
    const { showtimeId, seatNumber, userId } = bookingData;

    await validateShowtimeExists(
      this.bookingsService.showtimeRepository,
      showtimeId,
    );
    await validateBookingBeforeShowtimeEnds(
      this.bookingsService.showtimeRepository,
      showtimeId,
    );
    validateSeatNumber(seatNumber);
    validateUserId(userId);

    await validateUniqueSeatNumber(
      this.bookingsService.bookingRepository,
      showtimeId,
      seatNumber,
    );

    return this.bookingsService.createBooking(bookingData);
  }

  @Get()
  getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: number) {
    const booking = await this.bookingsService.getBookingById(id);

    if (!booking) {
      throw new BadRequestException(`Booking with ID ${id} not found.`);
    }

    return booking;
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: number) {
    const result = await this.bookingsService.deleteBooking(id);

    if (!result.affected) {
      throw new BadRequestException(`Booking with ID ${id} does not exist.`);
    }

    return { message: `Booking with ID ${id} was deleted successfully.` };
  }
}
