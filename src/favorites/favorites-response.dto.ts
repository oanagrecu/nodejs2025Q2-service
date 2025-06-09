import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';

export class FavoritesResponseDto {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
import { IsUUID, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateFavoritesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  artistsIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  albumsIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  tracksIds: string[];
}
