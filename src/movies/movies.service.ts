import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newMovie = this.movieRepository.create(movieData);
    return await this.movieRepository.save(newMovie);
  }

  async updateMovie(
    title: string,
    updatedData: UpdateMovieDto,
  ): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { title } });

    if (!movie) {
      throw new NotFoundException({
        message: `The movie with title '${title}' was not found.`,
        possibleSolution: 'Please check the spelling or add the movie first.',
      });
    }

    Object.assign(movie, updatedData);
    return await this.movieRepository.save(movie);
  }

  async deleteMovie(title: string): Promise<void> {
    const result = await this.movieRepository.delete({ title });

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with title '${title}' not found.`);
    }
  }
}
