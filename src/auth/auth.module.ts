import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { AccessTokenStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { RefreshTokenStrategy } from './jwt-refresh.strategy';
import { AccessTokenGuard } from './jwt-auth.guard';
import { RefreshTokenGuard } from './jwt-refresh-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '60s',
        issuer: 'Ronaldo',
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
