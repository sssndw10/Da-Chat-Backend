import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { salt } from './auth.constants';

interface InputUser {
  userId: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (!user) return undefined;

    if (await bcrypt.compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: InputUser) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(username: string, password: string) {
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await this.usersService.createOne(username, encryptedPassword);
    return this.login({
      userId: user.userId,
      username: user.username,
    });
  }
}
