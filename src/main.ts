import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/infrastructure/filters/http-exception.filter';
import { ServerExceptionFilter } from './common/infrastructure/filters/server-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the logger from the context
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors): BadRequestException => {
        return new BadRequestException(validationErrors);
      },
    }),
  );
  app.useGlobalFilters(new ServerExceptionFilter(new HttpExceptionFilter(), logger));

  await app.listen(3000);
}
bootstrap();
