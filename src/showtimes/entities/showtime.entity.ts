import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.id, { nullable: false })
  movieId: number;

  @Column({ nullable: false })
  theater: string;

  @Column({ type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_time: Date;

  @Column({ type: 'float', nullable: false })
  price: number;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];
}
