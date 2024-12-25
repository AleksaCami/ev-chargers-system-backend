import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ResponseDto } from '../results/dto/base-response.dto';

@Injectable()
export class ResponseService {
  success<T>(message: string, data: T): ResponseDto<T> {
    return plainToInstance(ResponseDto, {
      status: 'success',
      message,
      data,
    });
  }

  error<T>(message: string, data?: T): ResponseDto<T> {
    return plainToInstance(ResponseDto, {
      status: 'error',
      message,
      data: data || null,
    });
  }
}
