import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('./validators/booking.validator', () => ({
  validateSeatNumber: jest.fn(),
  validateUserId: jest.fn(),
  validateUniqueSeatNumber: jest.fn(),
  validateShowtimeExists: jest.fn(),
  validateBookingBeforeShowtimeEnds: jest.fn(),
}));

describe('BookingsController', () => {
  let controller: BookingsController;

  const mockService = {
    createBooking: jest.fn(),
    getAllBookings: jest.fn(),
    getBookingById: jest.fn(),
    updateBooking: jest.fn(),
    deleteBooking: jest.fn(),
    showtimeRepository: {},
    bookingRepository: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should create a booking', async () => {
    const dto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: 'user123',
    };
    mockService.createBooking.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.createBooking(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should get all bookings', async () => {
    const mockResult = [{ id: 1 }, { id: 2 }];
    mockService.getAllBookings.mockResolvedValue(mockResult);

    const result = await controller.getAllBookings();
    expect(result).toEqual(mockResult);
  });

  it('should return a booking by id', async () => {
    const booking = { id: 1 };
    mockService.getBookingById.mockResolvedValue(booking);

    const result = await controller.getBookingById(1);
    expect(result).toEqual(booking);
  });

  it('should throw NotFound if booking not found on get', async () => {
    mockService.getBookingById.mockResolvedValue(null);
    await expect(controller.getBookingById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update booking', async () => {
    const updated = { seatNumber: 6 };
    const existing = { id: 1 };
    mockService.getBookingById.mockResolvedValue(existing);
    mockService.updateBooking.mockResolvedValue({ ...existing, ...updated });

    const result = await controller.updateBooking(
      1,
      updated as UpdateBookingDto,
    );
    expect(result).toEqual({ id: 1, seatNumber: 6 });
  });

  it('should throw NotFound on update if not exists', async () => {
    mockService.getBookingById.mockResolvedValue(null);
    await expect(
      controller.updateBooking(1, {} as UpdateBookingDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete booking successfully', async () => {
    mockService.deleteBooking.mockResolvedValue({
      message: 'Booking with ID 1 was deleted successfully.',
    });
    const res = await controller.deleteBooking(1);
    expect(res.message).toContain('deleted successfully');
  });

  it('should throw BadRequest if booking not found on delete', async () => {
    mockService.deleteBooking.mockResolvedValue(null);
    await expect(controller.deleteBooking(999)).rejects.toThrow(
      BadRequestException,
    );
  });
});
