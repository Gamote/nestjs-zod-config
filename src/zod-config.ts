import { Injectable } from "@nestjs/common";

import { UnknownZodObjectSchema, ZodConfigType } from "./types";
import { ZodConfigOptions } from "./zod-config-options.inteface";
import { ZodConfigStatic } from "./zod-config-static";

import type { z } from "zod";

/**
 * Method that helps consumers to create a `ZodConfigStatic` in a structured way.
 *
 * Also "forces" the service to carry the schema as a static property so we can
 * access it later when we want to help consumers to instantiate the class outside
 * the NestJS context.
 *
 * TODO: try to make methods asynchronous
 *
 * @param schema
 * @param options
 */
export const ZodConfig = <Schema extends UnknownZodObjectSchema>(
  schema: Schema,
  options?: ZodConfigOptions<Schema>,
): ZodConfigType<Schema> => {
  @Injectable()
  class ZodConfig extends ZodConfigStatic<Schema> {
    public static readonly schema = schema;

    constructor() {
      super(schema, options);
    }

    /**
     * Create a new instance with additional overrides
     * Useful for testing scenarios where you need different configuration values
     * without modifying the original class configuration
     */
    static withOverrides(overrides: Partial<z.infer<Schema>>): ZodConfigStatic<Schema> {
      const mergedOptions: ZodConfigOptions<Schema> = {
        ...options,
        overrides: { ...options?.overrides, ...overrides },
      };
      
      // Create a new ZodConfigStatic instance with the merged options
      return new ZodConfigStatic(schema, mergedOptions);
    }
  }

  return ZodConfig;
};
