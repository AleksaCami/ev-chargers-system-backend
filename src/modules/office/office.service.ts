import { Injectable } from '@nestjs/common';

import { BaseService } from '../../common/services/base/base.service';
import { OfficeEntity } from '../../entities';
import { OfficeRepository } from '../../repositories/office.repository';
import { CreateOfficeDTO } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

@Injectable()
export class OfficeService extends BaseService<OfficeEntity> {
  constructor(private readonly officeRepository: OfficeRepository) {
    super(officeRepository);
  }

  /**
   * Finds a office by ID.
   * @param id - Office ID.
   * @returns Office or null if not found.
   */
  async findById(id: number): Promise<OfficeEntity | null> {
    return this.officeRepository.findOne({ id });
  }

  /**
   * Creates a new office.
   * @param createOfficeDto - The DTO containing office creation data.
   * @returns The created UserEntity.
   */
  async create(createOfficeDto: CreateOfficeDTO): Promise<OfficeEntity> {
    const newOffice = await this.officeRepository.create(createOfficeDto);
    return newOffice.save();
  }

  /**
   * Updates an existing office.
   * @param id - The ID of the office to update.
   * @param updateOfficeDto - The DTO containing the updated office data.
   * @returns The updated OfficeEntity.
   */
  async update(id: number, updateUserDto: UpdateOfficeDto): Promise<OfficeEntity> {
    await this.officeRepository.update({ id }, updateUserDto);
    return this.officeRepository.findOne({ id });
  }

  /**
   * Deletes a office by ID.
   * @param id - Office ID.
   * @returns The deletion status.
   */
  async delete(id: number): Promise<void> {
    await this.officeRepository.delete({ id });
  }

}
