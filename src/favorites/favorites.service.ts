import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { FavoritesResponseDto } from './favorites-response.dto';
@Injectable()
export class FavoritesService {
  private favoriteArtistIds: string[] = [];
  private favoriteAlbumIds: string[] = [];
  private favoriteTrackIds: string[] = [];

  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async getAll(): Promise<FavoritesResponseDto> {
    const [artists, albums, tracks] = await Promise.all([
      this.artistRepository.findByIds(this.favoriteArtistIds),
      this.albumRepository.findByIds(this.favoriteAlbumIds),
      this.trackRepository.findByIds(this.favoriteTrackIds),
    ]);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    if (this.favoriteArtistIds.includes(id)) {
      throw new UnprocessableEntityException('Artist already in favorites');
    }

    this.favoriteArtistIds.push(id);
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    if (this.favoriteAlbumIds.includes(id)) {
      throw new UnprocessableEntityException('Album already in favorites');
    }

    this.favoriteAlbumIds.push(id);
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    if (this.favoriteTrackIds.includes(id)) {
      throw new UnprocessableEntityException('Track already in favorites');
    }

    this.favoriteTrackIds.push(id);
  }

  async removeArtist(id: string): Promise<void> {
    const index = this.favoriteArtistIds.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }

    this.favoriteArtistIds.splice(index, 1);
  }

  async removeAlbum(id: string): Promise<void> {
    const index = this.favoriteAlbumIds.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }

    this.favoriteAlbumIds.splice(index, 1);
  }

  async removeTrack(id: string): Promise<void> {
    const index = this.favoriteTrackIds.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }

    this.favoriteTrackIds.splice(index, 1);
  }
}
