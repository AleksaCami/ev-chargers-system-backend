import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ResponseService } from '../../common/services/response.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService

  ) { }

  /**
   * Finds a user by email.
   * @param email - User's email.
   * @returns UserEntity or null if not found.
   */
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);

    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return this.responseService.success('User fetched successfully', userResponse);
  }

  /**
   * Finds a user by ID.
   * @param id - User's ID.
   * @returns UserEntity or null if not found.
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    const user = await this.userService.findById(id);

    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return this.responseService.success('User fetched successfully', userResponse);
  }

  /**
   * Creates a new user.
   * @param createUserDto - The DTO containing user creation data.
   * @returns The created UserEntity.
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return this.responseService.success('User created successfully', userResponse);
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The DTO containing the updated user data.
   * @returns The updated UserEntity.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);

    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return this.responseService.success('User updated successfully', userResponse);
  }

  /**
   * Deletes a user by ID.
   * @param id - User's ID.
   * @returns The deletion status.
   */
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
