import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User } from './user.interface';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOneById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
    };
    this.users.push(newUser);
    return newUser;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): User {
    const user = this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== dto.oldPassword)
      throw new ForbiddenException('Wrong password');
    user.password = dto.newPassword;
    return user;
  }

  delete(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }

  validateUUID(id: string) {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
    }
  }
}
