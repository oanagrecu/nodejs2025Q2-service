import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Name of the artist',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the artist has won a Grammy',
  })
  @IsBoolean()
  @IsOptional()
  grammy?: boolean;
}
