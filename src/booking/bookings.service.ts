import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    public readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Showtime)
    public readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    const { showtimeId, seatNumber } = bookingData;

    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found.`);
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: { showtimeId, seatNumber },
    });

    if (existingBooking) {
      throw new BadRequestException(
        `Seat number ${seatNumber} is already booked for this showtime.`,
      );
    }

    const newBooking = this.bookingRepository.create(bookingData);
    return await this.bookingRepository.save(newBooking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }

  async getBookingById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }

    return booking;
  }

  async deleteBooking(id: number): Promise<DeleteResult> {
    const result = await this.bookingRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }

    return result;
  }
}
