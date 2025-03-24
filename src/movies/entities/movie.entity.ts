import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
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
}
