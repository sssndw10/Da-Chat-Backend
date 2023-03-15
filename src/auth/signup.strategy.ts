import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class SignupStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const foundUser = await this.authService.validateUser(username, password);

    if (foundUser) {
      throw new BadRequestException('User Already Exists Try Logging In');
    }
    return {
      username,
      password,
    };
  }
}
