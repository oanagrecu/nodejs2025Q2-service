import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlbumsService } from './album.service';
import { Album } from './album.entity';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Album> {
    return this.albumsService.findOne(id);
  }

  @Post()
  async create(@Body() album: CreateAlbumDto): Promise<Album> {
    return this.albumsService.create(album);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumsService.update(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.albumsService.remove(id);
  }
}
