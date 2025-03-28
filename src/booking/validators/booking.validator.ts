import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';

export const validateSeatNumber = (seatNumber: number) => {
  if (seatNumber < 1 || seatNumber > 100) {
    throw new BadRequestException(`Seat number must be between 1 and 100.`);
  }
};

export const validateUserId = (userId: string) => {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new BadRequestException('User ID must be a valid non-empty string.');
  }
};

export const validateUniqueSeatNumber = async (
  bookingRepository: Repository<Booking>,
  showtimeId: number,
  seatNumber: number,
) => {
  const existingBooking = await bookingRepository.findOne({
    where: { showtimeId, seatNumber },
  });

  if (existingBooking) {
    throw new BadRequestException(
      `Seat number ${seatNumber} is already booked for this showtime.`,
    );
  }
};

export const validateShowtimeExists = async (
  showtimeRepository,
  showtimeId: number,
) => {
  const showtime = await showtimeRepository.findOne({
    where: { id: showtimeId },
  });

  if (!showtime) {
    throw new NotFoundException(
      `Showtime with ID ${showtimeId} does not exist.`,
    );
  }
};

export const validateBookingBeforeShowtimeEnds = async (
  showtimeRepository,
  showtimeId: number,
) => {
  const showtime = await showtimeRepository.findOne({
    where: { id: showtimeId },
  });

  const now = new Date();
  if (showtime && now >= new Date(showtime.end_time)) {
    throw new BadRequestException(
      'Booking cannot be made after the showtime has ended.',
    );
  }
};
