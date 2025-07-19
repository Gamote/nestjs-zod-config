import type { UnknownZodObjectSchema } from "./types";
import type { URL } from "node:url";
import type { z } from "zod";

export interface ZodConfigOptions<Schema extends UnknownZodObjectSchema = UnknownZodObjectSchema> {
  /**
   * Path to the .env file(s)
   * @default '.env'
   */
  envFilePath?: string | string[] | URL;
  
  /**
   * Override specific configuration values for testing purposes
   * These values take precedence over environment variables and .env files
   */
  overrides?: Partial<z.infer<Schema>>;
}
