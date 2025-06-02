import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsDefined,
} from 'class-validator';

export class CreateAlbumDto {
  @IsDefined({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name should not be empty' })
  name: string;

  @IsDefined({ message: 'year is required' })
  @IsInt({ message: 'year must be an integer' })
  year: number;

  @IsDefined({ message: 'artistId is required' })
  @IsUUID('4', { message: 'artistId must be a valid UUID' })
  artistId: string;
}
