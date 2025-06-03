import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name should not be empty' })
  name?: string;

  @IsOptional()
  @IsInt({ message: 'year must be an integer' })
  year?: number;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID' })
  artistId?: string;
}
