import { IsOptional, IsString } from 'class-validator';

export class UpdateOfficeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address: string;
}
