import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get('/all')
  getAllShowtimes(): Promise<Showtime[]> {
    return this.showtimesService.getAllShowtimes();
  }

  @Post()
  addShowtime(@Body() showtimeData: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimesService.addShowtime(showtimeData);
  }

  @Get('/:id')
  getShowtimeById(@Param('id') id: number): Promise<Showtime> {
    return this.showtimesService.getShowtimeById(id);
  }

  @Put('/update/:id')
  updateShowtime(
    @Param('id') id: number,
    @Body() updatedData: UpdateShowtimeDto,
  ): Promise<Showtime> {
    return this.showtimesService.updateShowtime(id, updatedData);
  }

  @Delete('/:id')
  deleteShowtime(@Param('id') id: number): Promise<void> {
    return this.showtimesService.deleteShowtime(id);
  }
}
