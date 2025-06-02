import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

import { ArtistService } from '../artists/artist.service';
import { Artist } from '../artists/artist.interface';

import { AlbumService } from '../albums/album.service';
import { Album } from '../albums/album.interface';

import { TrackService } from '../tracks/track.service';
import { Track } from '../tracks/track.interface';

import { Favorites } from './favorites.interface';

@Injectable()
export class FavoritesService {
  private favoritesByUser: Record<string, Favorites> = {};

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  private validateUUID(value: string, name: string): void {
    if (!isUUID(value)) {
      throw new BadRequestException(`${name} is not a valid UUID`);
    }
  }

  private ensureUserFavorites(userId: string): Favorites {
    if (!this.favoritesByUser[userId]) {
      this.favoritesByUser[userId] = {
        artists: [],
        albums: [],
        tracks: [],
      };
    }
    return this.favoritesByUser[userId];
  }

  private validateEntityExists(
    findFn: (id: string) => unknown,
    id: string,
    entityType: string,
  ): void {
    try {
      findFn(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `${entityType} with id "${id}" does not exist`,
        );
      }
      throw err;
    }
  }

  private addToFavorites(userId: string, id: string, list: string[]): void {
    if (!list.includes(id)) {
      list.push(id);
    }
  }

  private removeFromFavorites(
    userId: string,
    id: string,
    list: string[],
    entityType: string,
  ): void {
    const index = list.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(
        `${entityType} with id "${id}" is not in user "${userId}" favorites`,
      );
    }
    list.splice(index, 1);
  }

  getAllFavorites(userId: string): {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  } {
    this.validateUUID(userId, 'userId');

    const favs = this.ensureUserFavorites(userId);
    const artists = favs.artists.map((id) => this.artistService.findById(id));
    const albums = favs.albums.map((id) => this.albumService.findOne(id));
    const tracks = favs.tracks.map((id) => this.trackService.findOne(id));

    return { artists, albums, tracks };
  }

  addArtistToFavorites(userId: string, id: string) {
    this.validateUUID(userId, 'userId');
    this.validateUUID(id, 'artistId');
    this.validateEntityExists(
      this.artistService.findById.bind(this.artistService),
      id,
      'Artist',
    );

    const favs = this.ensureUserFavorites(userId);
    this.addToFavorites(userId, id, favs.artists);

    return {
      message: `Artist with id "${id}" added to user "${userId}" favorites`,
    };
  }

  removeArtistFromFavorites(userId: string, id: string) {
    this.validateUUID(userId, 'userId');
    this.validateUUID(id, 'artistId');

    const favs = this.ensureUserFavorites(userId);
    this.removeFromFavorites(userId, id, favs.artists, 'Artist');
  }

  addAlbumToFavorites(userId: string, id: string) {
    this.validateUUID(userId, 'userId');
    this.validateUUID(id, 'albumId');
    this.validateEntityExists(
      this.albumService.findOne.bind(this.albumService),
      id,
      'Album',
    );

    const favs = this.ensureUserFavorites(userId);
    this.addToFavorites(userId, id, favs.albums);

    return {
      message: `Album with id "${id}" added to user "${userId}" favorites`,
    };
  }

  removeAlbumFromFavorites(userId: string, id: string) {
    this.validateUUID(userId, 'userId');
    this.validateUUID(id, 'albumId');

    const favs = this.ensureUserFavorites(userId);
    this.removeFromFavorites(userId, id, favs.albums, 'Album');
  }

  addTrackToFavorites(userId: string, id: string) {
    this.validateUUID(userId, 'userId');
    this.validateUUID(id, 'trackId');
    this.validateEntityExists(
      this.trackService.findOne.bind(this.trackService),
      id,
      'Track',
    );

    const favs = this.ensureUserFavorites(userId);
    this.addToFavorites(userId, id, favs.tracks);

    return {
      message: `Track with id "${id}" added to user "${userId}" favorites`,
    };
  }

  removeTrackFromFavorites(userId: string, id: string) {
    this.validateUUID(userId, 'userId');
    this.validateUUID(id, 'trackId');

    const favs = this.ensureUserFavorites(userId);
    this.removeFromFavorites(userId, id, favs.tracks, 'Track');
  }

  removeIdFromAllUsers(type: 'artist' | 'album' | 'track', id: string) {
    for (const userId of Object.keys(this.favoritesByUser)) {
      const favs = this.favoritesByUser[userId];
      if (type === 'artist') {
        favs.artists = favs.artists.filter((x) => x !== id);
      } else if (type === 'album') {
        favs.albums = favs.albums.filter((x) => x !== id);
      } else if (type === 'track') {
        favs.tracks = favs.tracks.filter((x) => x !== id);
      }
    }
  }
}
