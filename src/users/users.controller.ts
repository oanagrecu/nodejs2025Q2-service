import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { User } from './users.interface';
import { validate as isUuid } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): User {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateUserDto): User {
    return this.userService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePasswordDto): User {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    this.userService.remove(id);
  }
}
