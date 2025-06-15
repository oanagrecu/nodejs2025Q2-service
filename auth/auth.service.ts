import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../src/users/user.service';
import { CreateUserDto } from '../src/users/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async signup(dto: CreateUserDto): Promise<{ id: string; message: string }> {
    const { login, password } = dto;

    const saltRounds = parseInt(this.configService.get('CRYPT_SALT'), 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.userService.create({
      login,
      password: hashedPassword,
    });

    return { id: newUser.id, message: 'User created successfully' };
  }

  async login(dto: LoginDto) {
    const { login, password } = dto;
    const user = await this.userService.findOneByLogin(login);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, login: user.login };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenException('No refresh token provided');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      const { userId, login } = payload as { userId: string; login: string };

      const accessToken = this.jwtService.sign(
        { userId, login },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn:
            this.configService.get<string>('TOKEN_EXPIRE_TIME') || '1h',
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { userId, login },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
          expiresIn:
            this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME') ||
            '24h',
        },
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
