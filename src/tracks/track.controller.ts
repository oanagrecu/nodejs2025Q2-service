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
import { TracksService } from './track.service';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TracksService) {}

  @Get()
  async getAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    const track = await this.trackService.findOneById(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(201) // <-- Add this decorator here to set status 201 explicitly
  async create(@Body() createTrackDto: CreateTrackDto) {
    const track = await this.trackService.create(createTrackDto);

    return {
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    await this.trackService.delete(id);
  }
}
