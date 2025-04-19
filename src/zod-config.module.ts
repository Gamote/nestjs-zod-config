import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';

import { UnknownZodObjectSchema, ZodConfigType } from './types';

export interface ZodConfigModuleOptions {
  /**
   * If "true", it will be registered as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;
  config: ZodConfigType<UnknownZodObjectSchema>;
}

/**
 * Module to register ZodConfig as a provider in the NestJS DI container.
 */
@Module({})
export class ZodConfigModule {
  static forRoot(options: ZodConfigModuleOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: ZodConfigModule,
      providers: [options.config],
      exports: [options.config],
    };
  }
}
