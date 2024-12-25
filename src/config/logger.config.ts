import { registerAs } from '@nestjs/config';

import { LOGGER } from './../common/constants/constants';

export default registerAs(LOGGER, () => ({
  logLevel: process.env.LOG_LEVEL || 'info',
}));