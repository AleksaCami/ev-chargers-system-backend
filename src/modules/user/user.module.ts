import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResponseService } from '../../common/services/response.service';
import { UserEntity } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ResponseService],
  exports: [UserService, UserRepository],
})
export class UserModule { }