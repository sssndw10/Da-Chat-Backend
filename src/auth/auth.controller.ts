import {
  Controller,
  UseGuards,
  Request,
  Post,
  Get,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './jwt-auth.guard';
import { RefreshTokenGuard } from './jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() user) {
    return this.authService.signup(user.username, user.password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Request() req) {
    console.log('refresh eeqpo');
    return await this.authService.refreshAccessToken(
      req.user.username,
      req.user.refreshToken,
    );
  }
}
