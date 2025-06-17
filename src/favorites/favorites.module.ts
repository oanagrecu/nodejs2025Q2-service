import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { User } from '../users/user.entity';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { Favorites } from './favorites.entity';
import { ArtistModule } from '../artists/artist.module';

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    TypeOrmModule.forFeature([Favorites, User, Artist, Album, Track]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
