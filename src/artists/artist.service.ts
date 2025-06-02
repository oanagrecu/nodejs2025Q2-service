// src/artist/artist.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateArtistDto } from './create-artist.dto';
import { UpdateArtistDto } from './update-artist.dto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  findAll(): Artist[] {
    return this.artists;
  }

  findById(id: string): Artist {
    if (!isUuid(id)) throw new BadRequestException('Invalid artist id');
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    if (!isUuid(id)) throw new BadRequestException('Invalid artist id');
    const artist = this.findById(id);
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  delete(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid artist id');
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Artist not found');
    this.artists.splice(index, 1);
  }
}
