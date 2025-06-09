import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';
import { TracksService } from './track.service';
import { FavoritesModule } from '../favorites/favorites.module';
import { Track } from './track.entity';
@Module({
  imports: [
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([Track]),
  ],
  controllers: [TrackController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TrackModule {}
