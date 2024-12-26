import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { isPast, secondsToMilliseconds } from 'date-fns';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserEntity } from '../../../entities';
import { AccessTokenRepository } from '../../../repositories/access-token.repository';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private accessTokenRepository: AccessTokenRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Make sure expiration is checked
      secretOrKey: configService.get('auth.secret.jwtSecret'), // Get the secret key from config
    });
  }

  /**
   * Validate the JWT token and check access token status.
   * @param bearerToken The payload from the JWT token.
   * @returns The user account if valid.
   * @throws UnauthorizedException if token is invalid or expired.
   */
  async validate(bearerToken: JwtPayload): Promise<UserEntity> {
    // Check if the token has expired (using 'exp' in the JWT payload)
    if (isPast(secondsToMilliseconds(bearerToken.exp))) {
      throw new UnauthorizedException('Token has expired');
    }

    const accessToken = await this.accessTokenRepository.findByToken(bearerToken.jti);

    if (
      !accessToken ||
      isPast(accessToken.expiresAt)
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    // Optionally, you can associate the current access token with the user entity
    accessToken.user.setCurrentAuthToken(accessToken);

    // Return the user (or any other relevant entity information)
    return accessToken.user;
  }
}
