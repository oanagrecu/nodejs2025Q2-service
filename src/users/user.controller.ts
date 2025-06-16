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
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userService.toResponse(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    if (
      !login ||
      typeof login !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      throw new BadRequestException('Missing or invalid required fields');
    }

    try {
      return await this.userService.create({ login, password });
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Unexpected error');
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
      throw new BadRequestException('Invalid dto');
    }

    try {
      const updatedUser = await this.userService.updatePassword(
        id,
        oldPassword,
        newPassword,
      );
      return updatedUser;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      if (err instanceof ForbiddenException) {
        throw err;
      }
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    try {
      await this.userService.delete(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
