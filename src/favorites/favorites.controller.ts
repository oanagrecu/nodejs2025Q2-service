import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll(@Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string) {
    return this.favoritesService.getAllFavorites(userId);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('id') id: string,
  ) {
    return this.favoritesService.addArtistToFavorites(userId, id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('id') id: string,
  ) {
    this.favoritesService.removeArtistFromFavorites(userId, id);
  }
  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('id') id: string,
  ) {
    return this.favoritesService.addAlbumToFavorites(userId, id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('id') id: string,
  ) {
    this.favoritesService.removeAlbumFromFavorites(userId, id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('id') id: string,
  ) {
    return this.favoritesService.addTrackToFavorites(userId, id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('id') id: string,
  ) {
    this.favoritesService.removeTrackFromFavorites(userId, id);
  }
}
