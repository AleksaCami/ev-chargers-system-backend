import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeRepository } from 'src/repositories/office.repository';

import { ResponseService } from '../../common/services/response.service';
import { OfficeEntity } from '../../entities';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfficeEntity,
    ]),
  ],
  controllers: [OfficeController],
  providers: [ResponseService, OfficeService, OfficeRepository],
  exports: [OfficeRepository],
})
export class OfficeModule { }