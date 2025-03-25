import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('bookings')
@Unique(['showtimeId', 'seatNumber'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showtimeId: number;

  @Column()
  userId: string;

  @Column()
  seatNumber: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, {
    onDelete: 'CASCADE',
  })
  showtime: Showtime;
}
