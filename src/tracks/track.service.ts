import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  create(dto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      ...dto,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = { ...this.tracks[index], ...dto };
    this.tracks[index] = updatedTrack;

    return updatedTrack;
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(index, 1);
  }
}
