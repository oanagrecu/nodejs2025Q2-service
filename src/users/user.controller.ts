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
  NotFoundException,
  ForbiddenException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    const user = this.userService.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return {
      statusCode: 201,
      data: user,
    };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    try {
      const updatedUser = this.userService.updatePassword(id, dto);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid UUID');
    this.userService.delete(id);
  }
}
