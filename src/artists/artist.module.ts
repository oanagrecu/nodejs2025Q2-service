import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavoritesModule } from '../favorites/favorites.module';
import { Artist } from './artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { AlbumModule } from '../albums/album.module';
import { TrackModule } from '../tracks/track.module';

@Module({
  imports: [
    forwardRef(() => FavoritesModule),
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    TypeOrmModule.forFeature([Artist, Track, Album]),
  ],
  providers: [ArtistService],
  controllers: [ArtistController],
  exports: [ArtistService, TypeOrmModule],
})
export class ArtistModule {}
