import { Inject, Injectable, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { z } from 'zod';

import { UnknownRecord, UnknownZodSchema } from './types';

/**
 * A typed verson of {@link ConfigService}
 */
@Injectable()
export abstract class ZodConfigService<
  Schema extends z.ZodType<UnknownRecord> = z.ZodType<UnknownRecord>,
  SchemaType extends UnknownRecord = z.infer<Schema>,
> {
  /**
   * **IMPORTANT**: Make sure to define the schema when extending this class,
   * currently it is not possible to enforce it with `static abstract`.
   * Read more: https://github.com/microsoft/TypeScript/issues/34516
   */
  public static zodSchema: UnknownZodSchema;

  constructor(
    @Inject(ConfigService) public readonly configService: ConfigService<SchemaType, true>,
  ) {}

  /**
   * Wrap the {@link ConfigService.get} method so the consumer
   * doesn't have to provide the generic types.
   */
  get<PropertyPath extends keyof SchemaType>(propertyPath: PropertyPath): SchemaType[PropertyPath] {
    return this.configService.get(
      propertyPath as keyof SchemaType extends never ? string : keyof SchemaType,
    );
  }
}

/**
 * This is the factory method that creates a service that can be used across the app to access Zod validated configs.
 *
 * Another role of this method is to make sure the service carries the Zod schema, so it can be used in the `ConfigModule.forRoot()` method.
 *
 * @param schema
 */
export const ZodConfig = <Schema extends UnknownZodSchema>(
  schema: Schema,
): Type<ZodConfigService<Schema>> & { zodSchema: UnknownZodSchema } => {
  @Injectable()
  class ZodConfig extends ZodConfigService<Schema> {
    /**
     * **IMPORTANT**: Make sure to define the schema when extending this class,
     * currently it is not possible to enforce it with `static abstract`.
     * Read more: https://github.com/microsoft/TypeScript/issues/34516
     */
    public static zodSchema = schema;
  }

  return ZodConfig;
};
