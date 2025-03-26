import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
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

  @Get('/:id')
  getMovieById(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.moviesService.getMovieById(id);
  }

  @Post()
  addMovie(@Body() movieData: CreateMovieDto): Promise<Movie> {
    return this.moviesService.addMovie(movieData);
  }

  @Put('/update/:title')
  updateMovieByTitle(
    @Param('title') title: string,
    @Body() updatedData: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateMovieByTitle(title, updatedData);
  }

  @Put('/update/id/:id')
  updateMovieById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedData: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateMovieById(id, updatedData);
  }

  @Delete('/:title')
  deleteMovieByTitle(
    @Param('title') title: string,
  ): Promise<{ message: string }> {
    return this.moviesService.deleteMovieByTitle(title);
  }

  @Delete('/id/:id')
  deleteMovieById(@Param('id') id: number): Promise<{ message: string }> {
    return this.moviesService.deleteMovieById(id);
  }
}
