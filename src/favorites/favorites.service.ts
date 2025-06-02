import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

import { ArtistService } from '../artists/artist.service';
import { Artist } from '../artists/artist.interface';

import { AlbumService } from '../albums/album.service';
import { Album } from '../albums/album.interface';

import { TrackService } from '../tracks/track.service';
import { Track } from '../tracks/track.interface';

@Injectable()
export class FavoritesService {
  private favoriteArtistIds: string[] = [];
  private favoriteAlbumIds: string[] = [];
  private favoriteTrackIds: string[] = [];

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  /** GET /favs */
  getAllFavorites(): { artists: Artist[]; albums: Album[]; tracks: Track[] } {
    const artists = this.favoriteArtistIds.map((id) =>
      this.artistService.findById(id),
    );

    const albums = this.favoriteAlbumIds.map(
      (id) => this.albumService.findOne(id), // ← use findOne here
    );

    const tracks = this.favoriteTrackIds.map(
      (id) => this.trackService.findOne(id), // ← use findOne here
    );

    return { artists, albums, tracks };
  }

  /** POST /favs/track/:id */
  addTrackToFavorites(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('trackId is not a valid UUID');
    }

    try {
      this.trackService.findOne(id); // ← use findOne
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Track with id "${id}" does not exist`,
        );
      }
      throw err;
    }

    if (!this.favoriteTrackIds.includes(id)) {
      this.favoriteTrackIds.push(id);
    }

    return { message: `Track with id "${id}" added to favorites` };
  }

  /** DELETE /favs/track/:id */
  removeTrackFromFavorites(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('trackId is not a valid UUID');
    }

    const index = this.favoriteTrackIds.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Track with id "${id}" is not in favorites`);
    }

    this.favoriteTrackIds.splice(index, 1);
  }

  /** POST /favs/album/:id */
  addAlbumToFavorites(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('albumId is not a valid UUID');
    }

    try {
      this.albumService.findOne(id); // ← use findOne
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Album with id "${id}" does not exist`,
        );
      }
      throw err;
    }

    if (!this.favoriteAlbumIds.includes(id)) {
      this.favoriteAlbumIds.push(id);
    }

    return { message: `Album with id "${id}" added to favorites` };
  }

  /** DELETE /favs/album/:id */
  removeAlbumFromFavorites(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('albumId is not a valid UUID');
    }

    const index = this.favoriteAlbumIds.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Album with id "${id}" is not in favorites`);
    }

    this.favoriteAlbumIds.splice(index, 1);
  }

  /** POST /favs/artist/:id */
  addArtistToFavorites(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('artistId is not a valid UUID');
    }

    try {
      this.artistService.findById(id); // artistService already uses findById
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Artist with id "${id}" does not exist`,
        );
      }
      throw err;
    }

    if (!this.favoriteArtistIds.includes(id)) {
      this.favoriteArtistIds.push(id);
    }

    return { message: `Artist with id "${id}" added to favorites` };
  }

  /** DELETE /favs/artist/:id */
  removeArtistFromFavorites(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('artistId is not a valid UUID');
    }

    const index = this.favoriteArtistIds.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Artist with id "${id}" is not in favorites`);
    }

    this.favoriteArtistIds.splice(index, 1);
  }
}
