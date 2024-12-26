import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResponseService } from '../../common/services/response.service';
import { UserEntity } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

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