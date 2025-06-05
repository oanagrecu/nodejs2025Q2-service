
import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async refreshTokens(refreshToken: string) {
    try {
      // Verify the refresh token using refresh secret key
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const { userId, login } = payload as { userId: string; login: string };

      // Create new access token
      const accessToken = this.jwtService.sign(
        { userId, login },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
        },
      );

      // Create new refresh token
      const newRefreshToken = this.jwtService.sign(
        { userId, login },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
        },
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // If token invalid or expired
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
