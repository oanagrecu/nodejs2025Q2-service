import { IsString, IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  artistId: string;

  @IsUUID()
  albumId: string;

  @IsNumber()
  @Min(0)
  duration: number;
}
