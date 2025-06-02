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
  BadRequestException,
} from '@nestjs/common';
import { AlbumService, Album } from './album.service';
import { CreateAlbumDto } from './create-album.dto';
import { validate as isUUID } from 'uuid';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAll(): Album[] {
    return this.albumService.findAll();
  }
  @Get(':id')
  getOne(@Param('id') id: string): Album {
    if (!isUUID(id)) {
      throw new BadRequestException('albumId is not valid UUID');
    }
    return this.albumService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: Partial<CreateAlbumDto>,
  ): Album {
    if (!isUUID(id)) {
      throw new BadRequestException('albumId is not valid UUID');
    }
    const updated = this.albumService.update(id, updateAlbumDto);
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('albumId is not valid UUID');
    }
    this.albumService.delete(id);
  }
}
