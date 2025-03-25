import { BadRequestException } from '@nestjs/common';
import { LessThan, MoreThan, Between, Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';

export const validateStartTimeInFuture = (startTime: Date) => {
  if (startTime <= new Date()) {
    throw new BadRequestException('Start time must be a future date.');
  }
};

export const validateEndTimeAfterStartTime = (
  startTime: Date,
  endTime: Date,
) => {
  if (endTime <= startTime) {
    throw new BadRequestException('End time must be after start time.');
  }
};

export const validateNoOverlappingShowtimes = async (
  showtimeData: any,
  showtimeRepository: Repository<Showtime>,
) => {
  const startTime = new Date(showtimeData.start_time);
  const endTime = new Date(showtimeData.end_time);

  const overlappingShowtime = await showtimeRepository.findOne({
    where: [
      {
        theater: showtimeData.theater,
        start_time: LessThan(endTime),
        end_time: MoreThan(startTime),
      },
      {
        theater: showtimeData.theater,
        start_time: Between(startTime, endTime),
      },
      {
        theater: showtimeData.theater,
        end_time: Between(startTime, endTime),
      },
    ],
  });

  if (overlappingShowtime) {
    throw new BadRequestException(
      'This theater already has a scheduled showtime that overlaps with the selected time.',
    );
  }
};
