import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { FavoritesService } from '../favorites/favorites.service';

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string;
}

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(data: Omit<Album, 'id'>): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...data,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, data: Partial<Omit<Album, 'id'>>): Album {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.albums[index] = { ...this.albums[index], ...data };
    return this.albums[index];
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.albums.splice(index, 1);
    this.favoritesService.removeIdFromAllUsers('album', id);
  }
}
