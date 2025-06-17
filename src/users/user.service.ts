import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { validate as isUuid } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './response-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  public toResponse(user: User) {
    const { id, login, version, createdAt, updatedAt } = user;
    return {
      id,
      login,
      version,
      createdAt: createdAt.getTime(),
      updatedAt: updatedAt.getTime(),
    };
  }

  async findAll(): Promise<ReturnType<UserService['toResponse']>[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.toResponse(user));
  }
  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.usersRepository.create(dto);

    try {
      const saved = await this.usersRepository.save(user);
      return this.toResponse(saved);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Login already exists');
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async findByLogin(login: string) {
    return this.usersRepository.findOne({ where: { login } });
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    if (!oldPassword || !newPassword) {
      throw new BadRequestException(
        'Both old and new password must be provided',
      );
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordCorrect) {
      throw new ForbiddenException('Incorrect old password');
    }

    const saltRounds = this.configService.get<number>('CRYPT_SALT') || 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedNewPassword;
    user.version += 1;
    user.updatedAt = new Date();

    const updated = await this.usersRepository.save(user);
    return this.toResponse(updated);
  }

  async delete(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
