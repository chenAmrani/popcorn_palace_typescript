import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';

const mockShowtime: Showtime = {
  id: 1,
  theater: 'Theater 1',
  start_time: new Date(),
  end_time: new Date(Date.now() + 3600000),
  price: 50,
  movie: {
    id: 1,
    title: 'Test Movie',
    genre: 'Drama',
    duration: 120,
    rating: 8.5,
    release_year: 2024,
    showtimes: [],
  },
  bookings: [],
};

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockService = {
    getAllShowtimes: jest.fn().mockResolvedValue([mockShowtime]),
    getShowtimesWithBookingCount: jest.fn().mockResolvedValue([]),
    getShowtimeById: jest.fn().mockResolvedValue(mockShowtime),
    addShowtime: jest.fn().mockResolvedValue(mockShowtime),
    updateShowtime: jest
      .fn()
      .mockResolvedValue({ ...mockShowtime, price: 100 }),
    deleteShowtime: jest.fn().mockResolvedValue({
      message: 'Showtime with ID 1 was deleted successfully.',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should get all showtimes', async () => {
    const result = await controller.getAllShowtimes();
    expect(result).toEqual([mockShowtime]);
    expect(service.getAllShowtimes).toHaveBeenCalled();
  });

  it('should get showtimes with booking count', async () => {
    const result = await controller.getShowtimesWithBookingCount();
    expect(result).toEqual([]);
    expect(service.getShowtimesWithBookingCount).toHaveBeenCalled();
  });

  it('should get showtime by id', async () => {
    const result = await controller.getShowtimeById(1);
    expect(result).toEqual(mockShowtime);
    expect(service.getShowtimeById).toHaveBeenCalledWith(1);
  });

  it('should add a showtime', async () => {
    const dto = {} as CreateShowtimeDto;
    const result = await controller.addShowtime(dto);
    expect(result).toEqual(mockShowtime);
    expect(service.addShowtime).toHaveBeenCalledWith(dto);
  });

  it('should update a showtime', async () => {
    const dto = { price: 100 } as UpdateShowtimeDto;
    const result = await controller.updateShowtime(1, dto);
    expect(result.price).toBe(100);
    expect(service.updateShowtime).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a showtime', async () => {
    const result = await controller.deleteShowtime(1);
    expect(result.message).toContain('was deleted successfully');
    expect(service.deleteShowtime).toHaveBeenCalledWith(1);
  });
});
