import { UnknownZodObjectSchema, ZodConfigType } from './types';

export interface ZodConfigOptions {
  /**
   * If "true",it will be registered as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;
  config: ZodConfigType<UnknownZodObjectSchema>;
}
