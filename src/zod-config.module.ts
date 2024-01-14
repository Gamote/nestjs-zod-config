import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ZodConfigOptions } from './zod-config-options.inteface';

@Module({})
export class ZodConfigModule {
  static forRoot(options: ZodConfigOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: ZodConfigModule,
      imports: [
        ConfigModule.forRoot({
          validate: (config) => options.service.zodSchema.parse(config),
        }),
      ],
      providers: [options.service],
      exports: [options.service],
    };
  }
}
