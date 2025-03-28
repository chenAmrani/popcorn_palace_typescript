import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

const mockBooking: Booking = {
  id: 1,
  showtimeId: 1,
  seatNumber: 10,
  userId: 'user1',
  showtime: new Showtime(),
};

const mockShowtime: Showtime = {
  id: 1,
  theater: 'TEST',
  start_time: new Date(),
  end_time: new Date(),
  price: 20,
  movie: { id: 1, title: 'Test Movie' } as any,
  bookings: [] as any,
};

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockShowtimeRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepo,
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepo,
        },
      ],
    }).compile();

    service = module.get(BookingsService);

    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create booking successfully', async () => {
      mockShowtimeRepo.findOne.mockResolvedValue(mockShowtime);
      mockBookingRepo.findOne.mockResolvedValue(null);
      mockBookingRepo.create.mockReturnValue(mockBooking);
      mockBookingRepo.save.mockResolvedValue(mockBooking);

      const dto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 10,
        userId: 'user1',
      };

      const result = await service.createBooking(dto);
      expect(result).toEqual(mockBooking);
    });

    it('should throw if showtime not found', async () => {
      mockShowtimeRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createBooking({ showtimeId: 1, seatNumber: 1, userId: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw for invalid seat number', async () => {
      mockShowtimeRepo.findOne.mockResolvedValue(mockShowtime);

      await expect(
        service.createBooking({ showtimeId: 1, seatNumber: 150, userId: 'x' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for already booked seat', async () => {
      mockShowtimeRepo.findOne.mockResolvedValue(mockShowtime);
      mockBookingRepo.findOne.mockResolvedValue(mockBooking);

      await expect(
        service.createBooking({ showtimeId: 1, seatNumber: 10, userId: 'x' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings', async () => {
      mockBookingRepo.find.mockResolvedValue([mockBooking]);
      const result = await service.getAllBookings();
      expect(result).toEqual([mockBooking]);
    });
  });

  describe('getBookingById', () => {
    it('should return booking by ID', async () => {
      mockBookingRepo.findOne.mockResolvedValue(mockBooking);
      const result = await service.getBookingById(1);
      expect(result).toEqual(mockBooking);
    });

    it('should throw if booking not found', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      await expect(service.getBookingById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBooking', () => {
    it('should update and return booking', async () => {
      const updated = { ...mockBooking, seatNumber: 20 };
      mockBookingRepo.findOne.mockResolvedValue(mockBooking);
      mockBookingRepo.save.mockResolvedValue(updated);

      const result = await service.updateBooking(1, { seatNumber: 20 });
      expect(result.seatNumber).toBe(20);
    });

    it('should throw if booking not found', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateBooking(1, { seatNumber: 20 }),
      ).rejects.toThrow();
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking and return success message', async () => {
      mockBookingRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteBooking(1);
      expect(result.message).toContain('was deleted successfully');
    });

    it('should throw if booking not found', async () => {
      mockBookingRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteBooking(1)).rejects.toThrow(NotFoundException);
    });
  });
});
