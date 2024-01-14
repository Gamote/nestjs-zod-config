import { Type } from '@nestjs/common';

import { UnknownZodSchema } from './types';
import { ZodConfigService } from './zod.config';

export interface ZodConfigOptions {
  /**
   * If "true", the {@link ConfigModule} will be registered as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;
  service: Type<ZodConfigService> & { zodSchema: UnknownZodSchema };
}
