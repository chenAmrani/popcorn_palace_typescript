import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Movie } from '../movies/entities/movie.entity';

import {
  validateStartTimeInFuture,
  validateEndTimeAfterStartTime,
  validateNoOverlappingShowtimes,
} from './validators/showtime.validator';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getAllShowtimes(): Promise<Showtime[]> {
    return this.showtimeRepository.find({ relations: ['movie'] });
  }

  async getShowtimesWithBookingCount(): Promise<
    {
      id: number;
      theater: string;
      start_time: Date;
      end_time: Date;
      price: number;
      movie_title: string;
      ticketsSold: number;
    }[]
  > {
    return this.showtimeRepository
      .createQueryBuilder('s')
      .leftJoin('s.movie', 'm')
      .leftJoin('s.bookings', 'b')
      .select([
        's.id AS id',
        's.theater AS theater',
        's.start_time AS start_time',
        's.end_time AS end_time',
        's.price AS price',
        'm.title AS movie_title',
        'COUNT(b.id) AS "ticketsSold"',
      ])
      .groupBy('s.id')
      .addGroupBy('m.title')
      .orderBy('s.start_time', 'ASC')
      .getRawMany();
  }

  async getShowtimeById(id: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
    return showtime;
  }

  async addShowtime(showtimeData: CreateShowtimeDto): Promise<Showtime> {
    if (!showtimeData.theater) {
      throw new BadRequestException('theater is required.');
    }
    const { start_time, end_time, price, movieId } = showtimeData;

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException(
        'start_time or end_time is not a valid ISO date.',
      );
    }
    if (price <= 0) {
      throw new BadRequestException('Price must be a positive number.');
    }

    validateStartTimeInFuture(startTime);
    validateEndTimeAfterStartTime(startTime, endTime);

    try {
      await validateNoOverlappingShowtimes(
        showtimeData,
        this.showtimeRepository,
      );

      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movieId} not found.`);
      }

      const newShowtime = this.showtimeRepository.create({
        ...showtimeData,
        start_time: startTime,
        end_time: endTime,
      });
      newShowtime.movie = movie;

      return this.showtimeRepository.save(newShowtime);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async updateShowtime(
    id: number,
    updatedData: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const showtime = await this.getShowtimeById(id);

    const start_time = updatedData.start_time
      ? new Date(updatedData.start_time)
      : showtime.start_time;
    const endTime = updatedData.end_time
      ? new Date(updatedData.end_time)
      : showtime.end_time;

    if (updatedData.price && updatedData.price <= 0) {
      throw new BadRequestException('Price must be a positive number.');
    }

    if (updatedData.start_time || updatedData.end_time) {
      if (isNaN(start_time.getTime()) || isNaN(endTime.getTime())) {
        throw new BadRequestException(
          'start_time or end_time is not a valid ISO date.',
        );
      }

      validateStartTimeInFuture(start_time);
      validateEndTimeAfterStartTime(start_time, endTime);
      await validateNoOverlappingShowtimes(
        {
          ...showtime,
          ...updatedData,
          start_time: start_time,
          end_time: endTime,
        },
        this.showtimeRepository,
      );
    }

    if (updatedData.movieId) {
      const movie = await this.movieRepository.findOne({
        where: { id: updatedData.movieId },
      });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movie.id} not found.`);
      }
      showtime.movie = movie;
    }

    Object.assign(showtime, updatedData, {
      start_time: start_time,
      end_time: endTime,
    });

    return this.showtimeRepository.save(showtime);
  }

  async deleteShowtime(id: number): Promise<boolean> {
    const result = await this.showtimeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
    return true;
  }
}
