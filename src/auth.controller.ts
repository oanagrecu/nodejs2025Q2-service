// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      // No token provided
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'No refresh token provided',
      };
    }

    return this.authService.refreshTokens(refreshToken);
  }
}
