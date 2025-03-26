import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  async addMovie(movieData: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({
      where: {
        title: movieData.title,
        release_year: movieData.release_year,
      },
    });

    if (existingMovie) {
      throw new BadRequestException(
        `Movie "${movieData.title}" (${movieData.release_year}) already exists.`,
      );
    }

    const newMovie = this.movieRepository.create(movieData);

    try {
      return await this.movieRepository.save(newMovie);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Movie already exists.');
      }
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found.`);
    }

    return movie;
  }

  async updateMovieByTitle(
    title: string,
    updatedData: UpdateMovieDto,
  ): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { title } });

    if (!movie) {
      throw new NotFoundException(`Movie with title "${title}" not found.`);
    }

    Object.assign(movie, updatedData);
    return await this.movieRepository.save(movie);
  }

  async updateMovieById(
    id: number,
    updatedData: UpdateMovieDto,
  ): Promise<Movie> {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new BadRequestException(`Invalid ID provided: "${id}"`);
    }

    const movie = await this.movieRepository.findOne({
      where: { id: numericId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found.`);
    }

    Object.assign(movie, updatedData);
    return await this.movieRepository.save(movie);
  }

  async deleteMovieByTitle(title: string): Promise<{ message: string }> {
    const result = await this.movieRepository.delete({ title });

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with title "${title}" not found.`);
    }

    return { message: `Movie with title "${title}" was deleted successfully.` };
  }

  async deleteMovieById(id: number): Promise<{ message: string }> {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new BadRequestException(`Invalid ID provided: "${id}"`);
    }

    const result = await this.movieRepository.delete({ id: numericId });

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID "${id}" not found.`);
    }

    return { message: `Movie with ID "${id}" was deleted successfully.` };
  }
}
