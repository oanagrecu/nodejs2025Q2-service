import { IsString, IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateTrackDto {
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
