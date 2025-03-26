import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';

export function validateStartTimeInFuture(startTime: Date) {
  const now = new Date();
  if (startTime <= now) {
    throw new BadRequestException('Start time must be in the future.');
  }
}

export function validateEndTimeAfterStartTime(startTime: Date, endTime: Date) {
  if (endTime <= startTime) {
    throw new BadRequestException('End time must be after start time.');
  }
}

export async function validateNoOverlappingShowtimes(
  showtimeData:
    | CreateShowtimeDto
    | { theater: string; start_time: Date; end_time: Date },
  showtimeRepo: Repository<Showtime>,
) {
  const { theater, start_time, end_time } = showtimeData;

  const overlap = await showtimeRepo
    .createQueryBuilder('Showtime')
    .where('Showtime.theater = :theater', { theater })
    .andWhere(
      `(
        Showtime.start_time <= :end
        AND Showtime.end_time >= :start
      )`,
    )
    .setParameter('start', new Date(start_time))
    .setParameter('end', new Date(end_time))
    .getOne();

  if (overlap) {
    throw new BadRequestException(
      'This theater already has a scheduled showtime that overlaps with the selected time.',
    );
  }
}
