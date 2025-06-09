import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (err) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    if (!login || !password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.userService.create({ login, password });
      return user;
    } catch (err) {
      throw new HttpException(
        'User creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    const { oldPassword, newPassword } = dto;

    if (
      !oldPassword ||
      typeof oldPassword !== 'string' ||
      !newPassword ||
      typeof newPassword !== 'string'
    ) {
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.userService.updatePassword(
        id,
        oldPassword,
        newPassword,
      );
    } catch (err) {
      if (err.message === 'User not found') {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else if (err.message === 'Old password is wrong') {
        throw new HttpException(err.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    try {
      await this.userService.delete(id);
    } catch (err) {
      if (err.message === 'User not found') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
