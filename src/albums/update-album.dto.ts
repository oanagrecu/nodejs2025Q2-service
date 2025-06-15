import {
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
