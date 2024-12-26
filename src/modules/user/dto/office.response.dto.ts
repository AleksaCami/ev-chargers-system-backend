import { Expose } from 'class-transformer';

export class OfficeResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
