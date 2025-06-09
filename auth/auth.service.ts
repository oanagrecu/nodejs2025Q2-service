import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../src/users/user.service';
import { CreateUserDto } from '../src/users/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    const saltRounds = Number(this.configService.get('CRYPT_SALT')) || 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const newUser = await this.userService.create({
      login: createUserDto.login,
      password: hashedPassword,
    });

    return { id: newUser.id };
  }

  async login(login: string, password: string) {
    const user = await this.userService.findOneByLogin(login);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const payload = { userId: user.id, login: user.login };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME') || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn:
        this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME') || '24h',
    });

    return { accessToken, refreshToken };
  }
  async refreshTokens(refreshToken: string) {
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
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
