import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/all')
  getAllMovies(): Promise<Movie[]> {
    return this.moviesService.getAllMovies();
  }

  @Post()
  addMovie(@Body() movieData: CreateMovieDto): Promise<Movie> {
    return this.moviesService.addMovie(movieData);
  }

  @Put('/update/:title')
  updateMovie(
    @Param('title') title: string,
    @Body() updatedData: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateMovie(title, updatedData);
  }

  @Delete('/:title')
  deleteMovie(@Param('title') title: string): Promise<void> {
    return this.moviesService.deleteMovie(title);
  }
}
