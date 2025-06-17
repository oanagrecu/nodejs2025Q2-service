import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user123', description: 'User login name' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'strongPassword123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
