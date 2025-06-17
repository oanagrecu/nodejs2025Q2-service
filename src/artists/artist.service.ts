import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './create-artist.dto';
import { UpdateArtistDto } from './update-artist.dto';
import { Track } from '../tracks/track.entity';
import { Album } from '../albums/album.entity';
@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(artist);
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | null> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      return null;
    }

    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  async delete(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    await this.trackRepository
      .createQueryBuilder()
      .update()
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId: id })
      .execute();

    await this.albumRepository
      .createQueryBuilder()
      .update()
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId: id })
      .execute();

    // Now delete artist
    await this.artistRepository.delete(id);
  }
}
