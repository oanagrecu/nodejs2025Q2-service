import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'myusername' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'mypassword' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
