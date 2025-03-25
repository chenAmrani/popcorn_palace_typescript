import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MoviesModule,
    ShowtimesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
