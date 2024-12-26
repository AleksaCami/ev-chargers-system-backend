import { Injectable } from '@nestjs/common';

import { BaseService } from '../../../common/services/base/base.service';
import { UserEntity } from '../../../entities';
import { UserRepository } from '../../../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  /**
   * Finds a user by email.
   * @param email - User's email.
   * @returns UserEntity or null if not found.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ email });
  }

  /**
   * Finds a user by ID.
   * @param id - User's ID.
   * @returns UserEntity or null if not found.
   */
  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ id });
  }

  /**
   * Creates a new user.
   * @param createUserDto - The DTO containing user creation data.
   * @returns The created UserEntity.
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.userRepository.create(createUserDto);
    return newUser.save();
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The DTO containing the updated user data.
   * @returns The updated UserEntity.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update({ id }, updateUserDto);
    return this.userRepository.findOne({ id });
  }

  /**
   * Deletes a user by ID.
   * @param id - User's ID.
   * @returns The deletion status.
   */
  async delete(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

}
