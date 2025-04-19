import { UnknownZodObjectSchema, ZodConfigType } from "./types";

/**
 * Help consumers to instantiate the ZodConfig class outside the NestJS context.
 *
 * @param config
 */
export const loadZodConfig = <Schema extends UnknownZodObjectSchema>(
  config: ZodConfigType<Schema>,
) => new config(config.schema);
