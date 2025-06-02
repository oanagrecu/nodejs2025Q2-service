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
import { TrackService } from './track.service';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    const track = this.trackService.findOneById(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createTrackDto: CreateTrackDto) {
    // ValidationPipe will throw 400 if required fields missing or invalid
    const track = this.trackService.create(createTrackDto);
    return {
      statusCode: 201,
      data: track,
    };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    const updatedTrack = this.trackService.update(id, updateTrackDto);
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    this.trackService.delete(id);
  }
}
