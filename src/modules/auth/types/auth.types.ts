import { AccessTokenEntity, RefreshTokenEntity } from '../../../entities';
import { UserResponseDto } from '../../../modules/user/dto/user.response.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  exp: number;
  jti: string;
}

export type OAuthTokens = {
  accessToken: AccessTokenEntity;
  refreshToken: RefreshTokenEntity;
};

export type BearerTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthTokens = {
  oAuthTokens: OAuthTokens;
  bearerTokens: BearerTokens;
};

export type AuthUser = {
  bearerTokens: BearerTokens,
  user: UserResponseDto
}

export type RegisterAccountPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type AccountRegistrationdata = {
  email: string;
  password?: string;
  fullName?: string;
  officeId?: number;
};