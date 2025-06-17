import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AlbumsService } from './album.service';
import { Album } from './album.entity';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumsService) {}
  @Post()
  @HttpCode(201)
  async post(@Body() dto: CreateAlbumDto) {
    return this.albumsService.post(dto);
  }
  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.albumsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.albumsService.remove(id);
  }
}
