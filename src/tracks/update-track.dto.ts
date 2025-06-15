import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiProperty({ example: 'Updated Track Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @ApiPropertyOptional({
    example: 'e3aa6fd0-048c-4d2a-938a-41d258fe8f6e',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  albumId: string | null;

  @ApiProperty({ example: 300 })
  @IsNumber()
  duration: number;
}
