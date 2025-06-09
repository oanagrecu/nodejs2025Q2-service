import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findOneById(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create(dto);
    return this.trackRepository.save(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOneById(id);
    const updated = this.trackRepository.merge(track, dto);
    return this.trackRepository.save(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Track not found');
  }

  async nullifyArtistIdForTracks(artistId: string): Promise<void> {
    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }
}
