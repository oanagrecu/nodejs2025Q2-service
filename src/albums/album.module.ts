import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumsService } from './album.service';
import { AlbumController } from './album.controller';
import { Artist } from '../artists/artist.entity';
import { Album } from './album.entity';
import { Track } from '../tracks/track.entity';
import { ArtistModule } from '../artists/artist.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Album, Track, Artist]),
    forwardRef(() => ArtistModule),
  ],
  providers: [AlbumsService],
  controllers: [AlbumController],
  exports: [AlbumsService],
})
export class AlbumModule {}
