import { Expose } from 'class-transformer';

export class ResponseDto<T> {
  @Expose()
  status: string;

  @Expose()
  message: string;

  @Expose()
  data: T;

  constructor(status: string, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}