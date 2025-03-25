import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

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
  ) {}

  async getAllShowtimes(): Promise<Showtime[]> {
    return await this.showtimeRepository.find();
  }

  async addShowtime(showtimeData: CreateShowtimeDto): Promise<Showtime> {
    const startTime = new Date(showtimeData.start_time);
    const endTime = new Date(showtimeData.end_time);

    validateStartTimeInFuture(startTime);
    validateEndTimeAfterStartTime(startTime, endTime);

    await validateNoOverlappingShowtimes(showtimeData, this.showtimeRepository);

    const newShowtime = this.showtimeRepository.create({
      ...showtimeData,
      start_time: startTime,
      end_time: endTime,
    });

    return await this.showtimeRepository.save(newShowtime);
  }

  async getShowtimeById(id: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({ where: { id } });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    return showtime;
  }

  async updateShowtime(
    id: number,
    updatedData: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const showtime = await this.getShowtimeById(id);
    Object.assign(showtime, updatedData);
    return await this.showtimeRepository.save(showtime);
  }

  async deleteShowtime(id: number): Promise<void> {
    const result = await this.showtimeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
  }
}
