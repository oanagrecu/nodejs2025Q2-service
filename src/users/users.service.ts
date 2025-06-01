import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './users.interface';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as isUuid } from 'uuid';

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = [];

  findAll(): User[] {
    return this.users.map((u) => ({ ...u }));
  }

  findOne(id: string): User {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { ...user };
  }

  create(createDto: CreateUserDto): User {
    if (!createDto.login || !createDto.password) {
      throw new BadRequestException('Missing required fields');
    }
    const newUser = new UserEntity(createDto.login, createDto.password);
    this.users.push(newUser);
    return { ...newUser };
  }

  updatePassword(id: string, dto: UpdatePasswordDto): User {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return { ...user };
  }

  remove(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
