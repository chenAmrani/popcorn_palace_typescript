import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.CREATED)
  addShowtime(@Body() showtimeData: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimesService.addShowtime(showtimeData);
  }

  @Get('/bookings')
  getShowtimesWithBookingCount() {
    return this.showtimesService.getShowtimesWithBookingCount();
  }

  @Get('/:id')
  getShowtimeById(@Param('id', ParseIntPipe) id: number): Promise<Showtime> {
    return this.showtimesService.getShowtimeById(id);
  }

  @Put('/update/:id')
  updateShowtime(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedData: UpdateShowtimeDto,
  ): Promise<Showtime> {
    return this.showtimesService.updateShowtime(id, updatedData);
  }

  @Delete('/:id')
  async deleteShowtime(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const success = await this.showtimesService.deleteShowtime(id);
    if (!success) {
      throw new Error(`Showtime with ID ${id} not found.`);
    }
    return { message: `Showtime with ID ${id} was deleted successfully.` };
  }
}
