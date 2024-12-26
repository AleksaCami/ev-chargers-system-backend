import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOfficeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
