import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './favorites-response.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(): Promise<FavoritesResponseDto> {
    return this.favoritesService.getAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrackToFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.addTrack(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbumToFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.addAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtistToFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.addArtist(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrackFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.removeTrack(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbumFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.removeAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtistFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.removeArtist(id);
  }
}
