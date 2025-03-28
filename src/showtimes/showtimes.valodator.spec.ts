import {
  validateStartTimeInFuture,
  validateEndTimeAfterStartTime,
  validateNoOverlappingShowtimes,
} from './validators/showtime.validator';
import { BadRequestException } from '@nestjs/common';

describe('Showtime Validator Tests', () => {
  it('should throw BadRequestException if start_time is in the past', () => {
    const startTime = new Date('2020-01-01T00:00:00Z');
    expect(() => validateStartTimeInFuture(startTime)).toThrowError(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if end_time is before start_time', () => {
    const startTime = new Date('2025-12-01T10:00:00Z');
    const endTime = new Date('2025-12-01T09:00:00Z');
    expect(() =>
      validateEndTimeAfterStartTime(startTime, endTime),
    ).toThrowError(BadRequestException);
  });

  it('should throw BadRequestException if overlapping showtimes found', async () => {
    const showtimeData = {
      theater: 'Theater 1',
      start_time: new Date('2025-12-01T10:00:00Z'),
      end_time: new Date('2025-12-01T12:00:00Z'),
    };

    const mockQueryBuilder: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const mockShowtimeRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    await expect(
      validateNoOverlappingShowtimes(showtimeData, mockShowtimeRepo as any),
    ).rejects.toThrowError(BadRequestException);
  });
});
