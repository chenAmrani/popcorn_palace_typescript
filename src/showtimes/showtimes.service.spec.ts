import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import * as validator from './validators/showtime.validator';

const mockShowtime = {
  id: 1,
  theater: 'A',
  start_time: new Date('2025-12-01T10:00:00Z'),
  end_time: new Date('2025-12-01T12:00:00Z'),
  price: 50,
  movie: { id: 1, title: 'Matrix' },
};

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let movieRepo: jest.Mocked<Repository<Movie>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              addGroupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  it('should return all showtimes', async () => {
    showtimeRepo.find.mockResolvedValue([mockShowtime as Showtime]);
    const result = await service.getAllShowtimes();
    expect(result).toEqual([mockShowtime]);
  });

  it('should return empty array if no showtimes are found', async () => {
    showtimeRepo.find.mockResolvedValue([]);
    const result = await service.getAllShowtimes();
    expect(result).toEqual([]);
  });

  it('should get showtime by ID', async () => {
    showtimeRepo.findOne.mockResolvedValue(mockShowtime as Showtime);
    const result = await service.getShowtimeById(1);
    expect(result).toEqual(mockShowtime);
  });

  it('should throw NotFoundException when showtime is not found', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);
    await expect(service.getShowtimeById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if showtime not found', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);
    await expect(service.getShowtimeById(1)).rejects.toThrow(NotFoundException);
  });

  it('should delete showtime', async () => {
    showtimeRepo.delete.mockResolvedValue({ affected: 1, raw: [] });
    const result = await service.deleteShowtime(1);
    expect(result.message).toContain('deleted successfully');
  });

  it('should throw NotFoundException if showtime is not found for deletion', async () => {
    showtimeRepo.delete.mockResolvedValue({ affected: 0, raw: [] });
    await expect(service.deleteShowtime(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw on delete if not found', async () => {
    showtimeRepo.delete.mockResolvedValue({ affected: 0, raw: [] });
    await expect(service.deleteShowtime(1)).rejects.toThrow(NotFoundException);
  });

  it('should add showtime successfully', async () => {
    const dto: CreateShowtimeDto = {
      theater: 'A',
      movieId: 1,
      price: 25,
      start_time: new Date('2025-12-01T10:00:00Z'),
      end_time: new Date('2025-12-01T12:00:00Z'),
    };
    jest.spyOn(validator, 'validateStartTimeInFuture').mockImplementation();
    jest.spyOn(validator, 'validateEndTimeAfterStartTime').mockImplementation();
    jest.spyOn(validator, 'validateNoOverlappingShowtimes').mockResolvedValue();
    movieRepo.findOne.mockResolvedValue(mockShowtime.movie as Movie);
    showtimeRepo.create.mockReturnValue(mockShowtime as Showtime);
    showtimeRepo.save.mockResolvedValue(mockShowtime as Showtime);

    const result = await service.addShowtime(dto);
    expect(result).toEqual(mockShowtime);
  });

  it('should throw if price is invalid', async () => {
    await expect(
      service.addShowtime({
        theater: 'A',
        movieId: 1,
        price: -1,
        start_time: new Date(),
        end_time: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when start_time or end_time is invalid', async () => {
    await expect(
      service.addShowtime({
        theater: 'A',
        movieId: 1,
        price: 25,
        start_time: new Date('invalid-date'),
        end_time: new Date('invalid-date'),
      }),
    ).rejects.toThrow(BadRequestException);
  });
  it('should throw BadRequestException if movie not found', async () => {
    movieRepo.findOne.mockResolvedValue(null);
    await expect(
      service.addShowtime({
        theater: 'A',
        movieId: 999,
        price: 25,
        start_time: new Date('2025-12-01T10:00:00Z'),
        end_time: new Date('2025-12-01T12:00:00Z'),
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update showtime successfully', async () => {
    const updateDto: UpdateShowtimeDto = { price: 100 };
    jest.spyOn(validator, 'validateStartTimeInFuture').mockImplementation();
    jest.spyOn(validator, 'validateEndTimeAfterStartTime').mockImplementation();
    jest.spyOn(validator, 'validateNoOverlappingShowtimes').mockResolvedValue();
    showtimeRepo.findOne.mockResolvedValue(mockShowtime as Showtime);
    showtimeRepo.save.mockResolvedValue({
      ...mockShowtime,
      price: 100,
    } as Showtime);

    const result = await service.updateShowtime(1, updateDto);
    expect(result.price).toBe(100);
  });
  it('should throw NotFoundException when showtime to update does not exist', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);
    await expect(service.updateShowtime(999, { price: 50 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if price is invalid during update', async () => {
    const updateDto: UpdateShowtimeDto = { price: -1 };
    showtimeRepo.findOne.mockResolvedValue(mockShowtime as Showtime);
    await expect(service.updateShowtime(1, updateDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
