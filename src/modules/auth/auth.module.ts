import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JWT_EXP_TIME_IN_SECONDS } from '../../common/constants/auth.constants';
import { ResponseService } from '../../common/services/response.service';
import { AccessTokenEntity, RefreshTokenEntity, UserEntity } from '../../entities';
import { AccessTokenRepository } from '../../repositories/access-token.repository';
import { RefreshTokenRepository } from '../../repositories/refresh-token.repository';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AccessTokenEntity,
      RefreshTokenEntity
    ]),
    ConfigModule,
    // Auth
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (
        {
          global: true,
          secret: configService.get('auth.secret.jwtSecret'),
          signOptions: {
            expiresIn: JWT_EXP_TIME_IN_SECONDS,
          },
        }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService, AccessTokenRepository, RefreshTokenRepository, ResponseService],
  exports: [AuthService],
})
export class AuthModule { }
