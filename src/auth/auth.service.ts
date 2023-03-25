import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

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
    const foundUser = await this.validateUser(username, password);

    if (foundUser) {
      throw new BadRequestException('User Already Exists Try Logging In');
    }

    const encryptedPassword = await bcrypt.hash(password, 11);
    const user = await this.usersService.createOne(username, encryptedPassword);

    return this.login({
      userId: user.userId,
      username: user.username,
    });
  }

  async setTokens(username: string, accessToken: string, refreshToken: string) {
    const user = await this.usersService.findOne(username);
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
  }

  async refreshAccessToken(username: string, refreshToken: string) {
    const user = await this.usersService.findOne(username);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('No user or token found');

    if (user.refreshToken != refreshToken)
      throw new ForbiddenException('Token doesnt match');

    const accessToken = await this.jwtService.signAsync(
      { username: user.username, sub: user.userId },
      {
        secret: jwtConstants.secret,
        issuer: 'Ronaldo',
        expiresIn: '60s',
      },
    );

    user.accessToken = accessToken;

    return {
      accessToken: accessToken,
    };
  }
}
