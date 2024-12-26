import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/common/infrastructure/core/guards/jwt-auth.guard';

import { ResponseService } from '../../common/services/response.service';
import { CreateOfficeDTO } from './dto/create-office.dto';
import { OfficeResponseDto } from './dto/office.response.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficeService } from './office.service';

@Controller('office')
@UseGuards(JwtAuthGuard)
export class OfficeController {
  constructor(
    private readonly officeService: OfficeService,
    private readonly responseService: ResponseService

  ) { }

  /**
   * Finds a office by ID.
   * @param id - Office ID.
   * @returns OfficeEntity or null if not found.
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    const office = await this.officeService.findById(id);

    const officeResponse = plainToInstance(OfficeResponseDto, office, {
      excludeExtraneousValues: true,
    });
    return this.responseService.success('Office fetched successfully', officeResponse);
  }

  /**
   * Creates a new user.
   * @param createUserDto - The DTO containing user creation data.
   * @returns The created UserEntity.
   */
  @Post('/create')
  async create(@Body() createOfficeDto: CreateOfficeDTO) {
    const office = await this.officeService.create(createOfficeDto);

    const officeResponse = plainToInstance(OfficeResponseDto, office, {
      excludeExtraneousValues: true,
    });
    return this.responseService.success('Office created successfully', officeResponse);
  }

  /**
   * Updates an existing office.
   * @param id - The ID of the office to update.
   * @param updateUserDto - The DTO containing the updated office data.
   * @returns The updated OfficeEntity.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOfficeDto: UpdateOfficeDto,
  ) {
    const office = await this.officeService.update(id, updateOfficeDto);

    const officeResponse = plainToInstance(OfficeResponseDto, office, {
      excludeExtraneousValues: true,
    });

    return this.responseService.success('Office updated successfully', officeResponse);
  }

  /**
   * Deletes a office by ID.
   * @param id - Office ID.
   * @returns The deletion status.
   */
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.officeService.delete(id);
  }
}
