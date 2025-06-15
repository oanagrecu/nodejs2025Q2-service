import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { CreateAlbumDto } from './create-album.dto';
import { Track } from '../tracks/track.entity';
import { UpdateAlbumDto } from './update-album.dto';
import { Artist } from '../artists/artist.entity';
import { ArtistService } from '../artists/artist.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  async nullifyArtistIdForAlbums(artistId: string): Promise<void> {
    const albums = await this.albumRepository.find({ where: { artistId } });
    for (const album of albums) {
      album.artistId = null;
      await this.albumRepository.save(album);
    }
  }

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    try {
      return await this.albumRepository.findOneOrFail({ where: { id } });
    } catch {
      throw new NotFoundException('Album not found');
    }
  }

  async post(dto: CreateAlbumDto): Promise<Album> {
    if (dto.artistId) {
      const artist = await this.artistRepository.findOneBy({
        id: dto.artistId,
      });
      if (!artist) {
        throw new BadRequestException('Artist does not exist');
      }
    }

    const album = this.albumRepository.create({
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    });

    return this.albumRepository.save(album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const album = await this.findOne(id);

    if ('artistId' in dto && dto.artistId === '') {
      dto.artistId = null;
    }

    if (dto.artistId) {
      const artist = await this.artistRepository.findOneBy({
        id: dto.artistId,
      });
      if (!artist) {
        throw new BadRequestException('Artist does not exist');
      }
    }

    Object.assign(album, dto);
    return this.albumRepository.save(album);
  }
  async remove(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks'],
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (album.tracks.length) {
      await Promise.all(
        album.tracks.map((track) => {
          track.album = null;
          return this.trackRepository.save(track);
        }),
      );
    }

    await this.albumRepository.remove(album);
  }
}
