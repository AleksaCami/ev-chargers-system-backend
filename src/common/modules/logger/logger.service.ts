import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

@Injectable()
export class LoggerService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger) { }

  /**
   * Logs an info level message.
   * @param message The message to log.
   */
  info(message: string) {
    this.logger.log(message);  // Use specific log level methods
  }

  /**
   * Logs an error level message.
   * @param message The error message.
   */
  error(message: string) {
    this.logger.error(message);  // Pass the trace if provided
  }

  /**
   * Logs a warn level message.
   * @param message The warning message.
   */
  warn(message: string) {
    this.logger.warn(message);
  }

  /**
   * Logs a debug level message.
   * @param message The debug message.
   */
  debug(message: string) {
    this.logger.debug(message);
  }
}
