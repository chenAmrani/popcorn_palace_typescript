import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from '../src/booking/bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../src/booking/entities/booking.entity';
import { Showtime } from '../src/showtimes/entities/showtime.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockBookingRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

const mockShowtimeRepository = {
  findOne: jest.fn(),
};

describe('BookingsService', () => {
  let service: BookingsService;
  const showtimeId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  const validBooking = {
    id: 1,
    showtimeId,
    seatNumber: 10,
    userId: 'user_1',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create booking successfully', async () => {
    mockShowtimeRepository.findOne.mockResolvedValue({ id: showtimeId });
    mockBookingRepository.findOne.mockResolvedValue(null);
    mockBookingRepository.create.mockReturnValue(validBooking);
    mockBookingRepository.save.mockResolvedValue(validBooking);

    const result = await service.createBooking(validBooking);
    expect(result).toEqual(validBooking);
  });

  it('should throw if showtime not found', async () => {
    mockShowtimeRepository.findOne.mockResolvedValue(null);

    await expect(service.createBooking(validBooking)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if seat already booked', async () => {
    mockShowtimeRepository.findOne.mockResolvedValue({ id: showtimeId });
    mockBookingRepository.findOne.mockResolvedValue(validBooking);

    await expect(service.createBooking(validBooking)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if seat number is invalid (zero)', async () => {
    const booking = { ...validBooking, seatNumber: 0 };
    mockShowtimeRepository.findOne.mockResolvedValue({ id: showtimeId });

    await expect(service.createBooking(booking)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if seat number is too high', async () => {
    const booking = { ...validBooking, seatNumber: 101 };
    mockShowtimeRepository.findOne.mockResolvedValue({ id: showtimeId });

    await expect(service.createBooking(booking)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return all bookings', async () => {
    mockBookingRepository.find.mockResolvedValue([validBooking]);

    const result = await service.getAllBookings();
    expect(result).toEqual([validBooking]);
  });

  it('should return booking by ID', async () => {
    mockBookingRepository.findOne.mockResolvedValue(validBooking);

    const result = await service.getBookingById(validBooking.id);
    expect(result).toEqual(validBooking);
  });

  it('should throw if booking by ID not found', async () => {
    mockBookingRepository.findOne.mockResolvedValue(null);

    await expect(service.getBookingById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete booking successfully', async () => {
    mockBookingRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.deleteBooking(validBooking.id);
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw if booking delete fails', async () => {
    mockBookingRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.deleteBooking(999)).rejects.toThrow(NotFoundException);
  });
});
