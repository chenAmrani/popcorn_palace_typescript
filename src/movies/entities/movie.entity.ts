import { Showtime } from '../../showtimes/entities/showtime.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity('movies')
@Unique(['title', 'release_year'])
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  genre: string;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @Column({ type: 'float', nullable: false })
  rating: number;

  @Column({ type: 'int', nullable: false })
  release_year: number;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
