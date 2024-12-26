import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ResponseService } from '../../common/services/response.service';
import { UserEntity } from '../../entities';
import { UserResponseDto } from '../user/dto/user.response.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthTokens, AuthUser } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) { }

  /**
   * Registers a new user.
   * @param registerDto - User registration data.
   * @returns The registered user's details.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterUserDto) {
    const user: UserEntity = await this.authService.register(registerDto);

    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return this.responseService.success('User registered successfully', userResponse);
  }

  /**
   * Logs a user in.
   * @param loginDto - User login credentials.
   * @returns The authentication tokens.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const response: AuthUser = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return this.responseService.success('Login successful', response);
  }

  /**
   * Refreshes authentication tokens.
   * @param refreshTokenDto - The refresh token DTO.
   * @returns The new authentication tokens.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens: AuthTokens = await this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
    );
    return this.responseService.success('Tokens refreshed successfully', tokens);
  }
}
