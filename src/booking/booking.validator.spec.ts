import {
  validateSeatNumber,
  validateUserId,
  validateShowtimeExists,
  validateBookingBeforeShowtimeEnds,
} from './validators/booking.validator';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Booking Validators', () => {
  describe('validateSeatNumber', () => {
    it('should throw if seat number is less than 1', () => {
      expect(() => validateSeatNumber(0)).toThrowError(BadRequestException);
    });

    it('should throw if seat number is greater than 100', () => {
      expect(() => validateSeatNumber(101)).toThrowError(BadRequestException);
    });

    it('should pass if seat number is valid', () => {
      expect(() => validateSeatNumber(50)).not.toThrow();
    });
  });

  describe('validateUserId', () => {
    it('should throw if userId is not provided', () => {
      expect(() => validateUserId('')).toThrowError(BadRequestException);
    });

    it('should pass if userId is valid', () => {
      expect(() => validateUserId('user123')).not.toThrow();
    });
  });

  describe('validateShowtimeExists', () => {
    it('should throw if showtime does not exist', async () => {
      const mockShowtimeRepo = { findOne: jest.fn().mockResolvedValue(null) };
      await expect(
        validateShowtimeExists(mockShowtimeRepo, 1),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should pass if showtime exists', async () => {
      const mockShowtimeRepo = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
      };
      await expect(
        validateShowtimeExists(mockShowtimeRepo, 1),
      ).resolves.not.toThrow();
    });
  });

  describe('validateBookingBeforeShowtimeEnds', () => {
    it('should throw if booking is made after showtime has ended', async () => {
      const mockShowtimeRepo = {
        findOne: jest
          .fn()
          .mockResolvedValue({ end_time: new Date('2022-12-01') }),
      };
      await expect(
        validateBookingBeforeShowtimeEnds(mockShowtimeRepo, 1),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should pass if booking is before showtime ends', async () => {
      const mockShowtimeRepo = {
        findOne: jest
          .fn()
          .mockResolvedValue({ end_time: new Date('2025-12-01T12:00:00Z') }),
      };
      await expect(
        validateBookingBeforeShowtimeEnds(mockShowtimeRepo, 1),
      ).resolves.not.toThrow();
    });
  });
});
