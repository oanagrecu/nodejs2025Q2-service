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
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './create-artist.dto';
import { UpdateArtistDto } from './update-artist.dto';
import { Artist } from './artist.interface';
import { validate as uuidValidate } from 'uuid';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Artist> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateArtistDto) {
    const artist = await this.artistService.create(createArtistDto);
    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const updatedArtist = await this.artistService.update(id, updateArtistDto);
    if (!updatedArtist) {
      throw new NotFoundException('Artist not found');
    }
    return updatedArtist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    await this.artistService.delete(id);
  }
}
