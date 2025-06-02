import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Album } from './album.interface';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album {
    if (!isUuid(id)) throw new BadRequestException('Invalid album id');
    const album = this.albums.find((a) => a.id === id);
    if (!album) throw new NotFoundException(`Album with id "${id}" not found`);
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!isUuid(id)) throw new BadRequestException('Invalid album id');
    const album = this.findById(id);

    if (updateAlbumDto.name !== undefined) album.name = updateAlbumDto.name;
    if (updateAlbumDto.year !== undefined) album.year = updateAlbumDto.year;
    if (updateAlbumDto.artistId !== undefined)
      album.artistId = updateAlbumDto.artistId;

    return album;
  }

  delete(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid album id');
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1)
      throw new NotFoundException(`Album with id "${id}" not found`);
    this.albums.splice(index, 1);
  }
}
