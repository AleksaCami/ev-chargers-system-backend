import { Exclude, Expose, Type } from 'class-transformer';

import { OfficeResponseDto } from '../../office/dto/office.response.dto';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  @Type(() => OfficeResponseDto)
  office: OfficeResponseDto;

  @Exclude()
  password: string;
}
