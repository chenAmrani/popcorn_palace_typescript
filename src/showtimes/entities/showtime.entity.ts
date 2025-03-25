import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

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
}
