import { Type } from "@nestjs/common";

import { ZodConfigStatic } from "./zod-config-static";

import type { z } from "zod";

/**
 * Type representation of an object with unknown keys.
 */
export type UnknownRecord = Record<string, unknown>;

/**
 * Used in generic types to represent a Zod object schema with unknown keys.
 */
export type UnknownZodObjectSchema = z.ZodType<UnknownRecord>;

/**
 * Type representation of the dynamically generated ZodConfig class.
 */
export type ZodConfigType<Schema extends UnknownZodObjectSchema> = Type<
  ZodConfigStatic<Schema>
> & {
  schema: Schema;
};
