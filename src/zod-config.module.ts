import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';

import { ZodConfigOptions } from './zod-config-options.inteface';

/**
 * Module to register ZodConfig as a provider in the NestJS DI container.
 */
@Module({})
export class ZodConfigModule {
  static forRoot(options: ZodConfigOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: ZodConfigModule,
      providers: [options.configs],
      exports: [options.configs],
    };
  }
}
