import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Album } from './album.interface';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid album id');
    const album = this.albums.find((a) => a.id === id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  create(dto: CreateAlbumDto): Album {
    if (!dto.name || !dto.year)
      throw new BadRequestException('Missing required fields');
    const newAlbum: Album = {
      id: uuidv4(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      year: dto.year,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    const album = this.findOne(id);
    if (dto.name !== undefined) album.name = dto.name;
    if (dto.artistId !== undefined) album.artistId = dto.artistId;
    if (dto.year !== undefined) album.year = dto.year;
    return album;
  }

  delete(id: string): void {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid album id');
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Album not found');
    this.albums.splice(index, 1);
  }
}
