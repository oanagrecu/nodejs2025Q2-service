import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Album Name', description: 'Name of the album' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2023, description: 'Year the album was released' })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the artist',
  })
  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
