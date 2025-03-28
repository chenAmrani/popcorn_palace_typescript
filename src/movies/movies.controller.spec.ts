import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  genre: 'Drama',
  duration: 120,
  rating: 8.8,
  release_year: 2010,
  showtimes: [],
};

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockService = {
    getAllMovies: jest.fn(() => Promise.resolve([mockMovie])),
    getMovieById: jest.fn(() => Promise.resolve(mockMovie)),
    addMovie: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    updateMovieByTitle: jest.fn((title, dto) =>
      Promise.resolve({ ...mockMovie, ...dto }),
    ),
    updateMovieById: jest.fn((id, dto) =>
      Promise.resolve({ ...mockMovie, ...dto }),
    ),
    deleteMovieByTitle: jest.fn((title) =>
      Promise.resolve({
        message: `Movie with title "${title}" was deleted successfully.`,
      }),
    ),
    deleteMovieById: jest.fn((id) =>
      Promise.resolve({
        message: `Movie with ID "${id}" was deleted successfully.`,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should return all movies', async () => {
    const result = await controller.getAllMovies();
    expect(result).toEqual([mockMovie]);
    expect(service.getAllMovies).toHaveBeenCalled();
  });

  it('should return movie by ID', async () => {
    const result = await controller.getMovieById(1);
    expect(result).toEqual(mockMovie);
    expect(service.getMovieById).toHaveBeenCalledWith(1);
  });

  it('should create a new movie', async () => {
    const dto: CreateMovieDto = {
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: 120,
      rating: 8.8,
      release_year: 2010,
    };
    const result = await controller.addMovie(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.addMovie).toHaveBeenCalledWith(dto);
  });

  it('should update movie by title', async () => {
    const dto: UpdateMovieDto = { rating: 9 };
    const result = await controller.updateMovieByTitle('Inception', dto);
    expect(result.rating).toBe(9);
    expect(service.updateMovieByTitle).toHaveBeenCalledWith('Inception', dto);
  });

  it('should update movie by ID', async () => {
    const dto: UpdateMovieDto = { genre: 'Action' };
    const result = await controller.updateMovieById(1, dto);
    expect(result.genre).toBe('Action');
    expect(service.updateMovieById).toHaveBeenCalledWith(1, dto);
  });

  it('should delete movie by title', async () => {
    const result = await controller.deleteMovieByTitle('Inception');
    expect(result.message).toContain('was deleted successfully');
    expect(service.deleteMovieByTitle).toHaveBeenCalledWith('Inception');
  });

  it('should delete movie by ID', async () => {
    const result = await controller.deleteMovieById(1);
    expect(result.message).toContain('was deleted successfully');
    expect(service.deleteMovieById).toHaveBeenCalledWith(1);
  });
});
