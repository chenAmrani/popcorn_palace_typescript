import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  genre: 'Action',
  duration: 120,
  rating: 8.5,
  release_year: 2020,
};

describe('MoviesService', () => {
  let service: MoviesService;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  describe('getAllMovies', () => {
    it('should return all movies', async () => {
      mockRepo.find.mockResolvedValue([mockMovie]);
      const result = await service.getAllMovies();
      expect(result).toEqual([mockMovie]);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('addMovie', () => {
    it('should create a new movie', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(mockMovie);
      mockRepo.save.mockResolvedValue(mockMovie);

      const result = await service.addMovie(mockMovie as CreateMovieDto);
      expect(result).toEqual(mockMovie);
      expect(mockRepo.create).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw if movie already exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockMovie);
      await expect(
        service.addMovie(mockMovie as CreateMovieDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle duplicate error', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(mockMovie);
      mockRepo.save.mockRejectedValue({ code: '23505' });
      await expect(
        service.addMovie(mockMovie as CreateMovieDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockMovie);
      const result = await service.getMovieById(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw if movie not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.getMovieById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMovieByTitle', () => {
    it('should update movie by title', async () => {
      const updated = { ...mockMovie, rating: 9 };
      mockRepo.findOne.mockResolvedValue(mockMovie);
      mockRepo.save.mockResolvedValue(updated);
      const result = await service.updateMovieByTitle('Test Movie', {
        rating: 9,
      } as UpdateMovieDto);
      expect(result.rating).toBe(9);
    });

    it('should throw if movie not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateMovieByTitle('NotExist', {} as UpdateMovieDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMovieById', () => {
    it('should update movie by id', async () => {
      const updated = { ...mockMovie, genre: 'Comedy' };
      mockRepo.findOne.mockResolvedValue(mockMovie);
      mockRepo.save.mockResolvedValue(updated);
      const result = await service.updateMovieById(1, {
        genre: 'Comedy',
      } as UpdateMovieDto);
      expect(result.genre).toBe('Comedy');
    });

    it('should throw if movie not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateMovieById(999, {} as UpdateMovieDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle duplicate update', async () => {
      mockRepo.findOne.mockResolvedValue(mockMovie);
      mockRepo.save.mockRejectedValue({ code: '23505' });
      await expect(
        service.updateMovieById(1, { title: 'Duplicate' } as UpdateMovieDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteMovieByTitle', () => {
    it('should delete a movie by title', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteMovieByTitle('Test Movie');
      expect(result.message).toContain('was deleted successfully');
    });

    it('should throw if movie not found', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteMovieByTitle('Nope')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteMovieById', () => {
    it('should delete a movie by id', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteMovieById(1);
      expect(result.message).toContain('was deleted successfully');
    });

    it('should throw if movie not found', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteMovieById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
