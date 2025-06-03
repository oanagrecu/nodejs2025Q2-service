import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Track } from './track.interface';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = []; // Use plural 'tracks' to hold all track records

  findAll(): Track[] {
    return this.tracks;
  }

  findOneById(id: string): Track | undefined {
    return this.tracks.find((t) => t.id === id);
  }

  create(dto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(), // use 'uuidv4()' from the import (you imported it as uuidv4)
      name: dto.name, // name instead of title
      artistId: dto.artistId || null,
      albumId: dto.albumId || null,
      duration: dto.duration,
    };
    this.tracks.push(newTrack); // Push into 'tracks' array
    return newTrack;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    const track = this.findOneById(id);
    if (!track) throw new NotFoundException('Track not found');

    track.name = dto.name; // Use 'name', not 'title'
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return track;
  }

  delete(id: string): void {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Track not found');
    this.tracks.splice(index, 1);
  }
}
