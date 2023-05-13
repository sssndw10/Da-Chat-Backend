import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import mongoose from 'mongoose';

interface InputUser {
  userId: any;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByName(username);

    if (!user) return undefined;

    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
  }

  async login(user: InputUser) {
    const payload = { username: user.username, sub: user.userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      issuer: 'Ronaldo',
      expiresIn: '60s',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      issuer: 'Ronaldo',
      expiresIn: '12h',
    });

    this.setTokens(user.username, accessToken, refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signup(username: string, password: string) {
    const foundUser = await this.usersService.getUserByName(username);

    if (foundUser) {
      throw new BadRequestException('User Already Exists Try Logging In');
    }

    const user = await this.usersService.createUser(username, password);

    return this.login({
      userId: user._id,
      username: user.username,
    });
  }

  async setTokens(username: string, accessToken: string, refreshToken: string) {
    await this.usersService.updateUserByName(username, {
      $set: {
        accessToken,
        refreshToken,
      },
    });
  }

  async refreshAccessToken(username: string, refreshToken: string) {
    const user = await this.usersService.getUserByName(username);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('No user or token found');

    if (user.refreshToken != refreshToken)
      throw new ForbiddenException('Token doesnt match');

    const accessToken = await this.jwtService.signAsync(
      { username: user.username, sub: user._id },
      {
        secret: jwtConstants.secret,
        issuer: 'Ronaldo',
        expiresIn: '60s',
      },
    );

    user
      .updateOne({
        $set: {
          accessToken,
        },
      })
      .exec();

    return {
      accessToken,
    };
  }
}
