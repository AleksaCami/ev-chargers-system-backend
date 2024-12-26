import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { addSeconds } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { ACCESS_TOKEN_EXP_TIME_IN_SECONDS, REFRESH_TOKEN_EXP_TIME_IN_SECONDS } from '../../common/constants/auth.constants';
import { isEmpty } from '../../common/utils';
import { UserEntity } from '../../entities';
import { AccessTokenRepository } from '../../repositories/access-token.repository';
import { RefreshTokenRepository } from '../../repositories/refresh-token.repository';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../user/services/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AccountRegistrationdata, AuthTokens, AuthUser, JwtPayload } from './types/auth.types';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly accessTokenRepository: AccessTokenRepository
  ) { }

  /**
   * Registers an account.
   * @param data - Registration data.
   * @returns The created account
   */
  async register(
    data: RegisterUserDto,
  ): Promise<UserEntity> {
    let user = await this.userRepository.findByEmail(data.email);
    if (!isEmpty(user)) {
      throw new NotFoundException('User already exists');
    }

    const passwordHash = await UserEntity.hashPassword(data.password);

    user = await this.registerAccount({
      email: data.email,
      password: passwordHash,
      fullName: data.fullName,
      officeId: data.officeId,
    });

    return user;
  }

  /**
   * Registers a user.
   * @param data - User registration data.
   * @returns The created user.
   */
  async registerAccount(data: AccountRegistrationdata): Promise<UserEntity> {
    return this.userRepository.create({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      officeId: data.officeId
    });
  }

  /**
   * Finds user with the given email and password.
   * @param email - User's email.
   * @param password - User's password.
   */
  async authenticateAccount(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findWithCredentials(email);
    if (!user || !(await this.isAccountPasswordValid(user, password))) {
      return null;
    }
    return user;
  }

  /**
   * Logs the account in.
   * @param email - Account's email.
   * @param password - Account's password.
   * @returns Auth tokens - Set of OAuth and Bearer tokens.
   */
  async login(
    email: string,
    password: string,
  ): Promise<AuthUser> {
    const user = await this.authenticateAccount(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { bearerTokens } = await this.generateTokens(user);

    return { user, bearerTokens }
  }

  /**
   * Generates OAuth and Bearer tokens for the given account.
   * @param user: UserEntity
   * @return {AuthTokens} - Generated OAuth and Bearer tokens.
   */
  async generateTokens(user: UserEntity): Promise<AuthTokens> {
    const accessToken = await this.accessTokenRepository.create({
      user: user,
      token: uuidv4(),
      expiresAt: addSeconds(new Date(), ACCESS_TOKEN_EXP_TIME_IN_SECONDS),
    });
    const refreshToken = await this.refreshTokenRepository.create({
      accessTokenId: accessToken.id,
      expiresAt: addSeconds(new Date(), REFRESH_TOKEN_EXP_TIME_IN_SECONDS),
      token: uuidv4()
    });

    const oAuthTokens = { accessToken, refreshToken };

    const bearerTokens = {
      accessToken: this.jwtService.sign({
        jti: accessToken.id,
        sub: user.id,
      }),
      refreshToken: this.jwtService.sign({
        jti: refreshToken.id,
        sub: accessToken.id,
      }),
    };

    return { oAuthTokens, bearerTokens };
  }

  /**
   * Validates if the given password is indeed the user's password.
   * @param {UserEntity} user - UserEntity.
   * @param {string} password - Password to validate.
   * @returns boolean - Is password valid.
   */
  async isAccountPasswordValid(
    user: UserEntity,
    password: string,
  ): Promise<boolean> {
    const salt = bcrypt.getSalt(user.password);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash === user.password;
  }

  /**
   * Refreshes the authorization tokens.
   * @param token - Encoded bearer refresh token.
   * @returns {AuthTokens} - Auth tokens.
   */
  async refreshTokens(
    token: string,
  ): Promise<AuthTokens> {
    const bearerToken = this.jwtService.decode(token) as JwtPayload;

    if (!bearerToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    const refreshToken = await this.refreshTokenRepository.findValidById(
      bearerToken.jti,
    );
    if (
      !refreshToken ||
      !refreshToken.accessToken
    ) {
      throw new BadRequestException('Invalid refresh token');
    }

    await this.accessTokenRepository.delete({ id: refreshToken.accessTokenId });
    return this.generateTokens(refreshToken.accessToken.user);
  }
}
