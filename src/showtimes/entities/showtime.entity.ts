import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  theater: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'float' })
  price: number;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];
}
