import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';

import { ApiProperty } from '@nestjs/swagger';
export class FavoritesResponseDto {
  @ApiProperty({ type: [Artist] })
  artists: Artist[];

  @ApiProperty({ type: [Album] })
  albums: Album[];

  @ApiProperty({ type: [Track] })
  tracks: Track[];
}

import { IsUUID, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
export class CreateFavoritesDto {
  @ApiProperty({
    type: [String],
    example: ['e7d1e1e2-1c1a-4c52-81d2-1b9f3c9b243e'],
    description: 'Array of artist UUIDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  artistsIds: string[];

  @ApiProperty({
    type: [String],
    example: ['b812cc9d-b2de-4e7a-8f75-6b1432a4e113'],
    description: 'Array of album UUIDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  albumsIds: string[];

  @ApiProperty({
    type: [String],
    example: ['4cb01139-2300-44a1-861e-479a3957eae1'],
    description: 'Array of track UUIDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  tracksIds: string[];
}
