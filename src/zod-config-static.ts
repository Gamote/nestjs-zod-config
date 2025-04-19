import * as process from "process";

import dotenv from "dotenv";

import { UnknownZodObjectSchema } from "./types";
import { ZodConfigOptions } from "./zod-config-options.inteface";

import type { z } from "zod";

/**
 * This class is the base class for this module.
 * It will read the .env file and parse it using the `zod` schema provided by the consumer.
 */
export class ZodConfigStatic<Schema extends UnknownZodObjectSchema> {
  private readonly config: z.infer<Schema>;

  constructor(schema: Schema, options?: ZodConfigOptions) {
    let configObject = process.env;

    // Override the environment variables obtained from `process.env`
    // with the ones obtained from the `.env` file if it exists.
    try {
      configObject = {
        ...configObject,
        ...dotenv.config({ path: options?.envFilePath }).parsed,
      };
    } catch {
      throw new Error(`Error parsing .env file`);
    }

    this.config = schema.parse(configObject) as z.infer<Schema>;
  }

  get<K extends keyof z.infer<Schema>>(key: K): z.infer<Schema>[K] {
    return this.config[key];
  }
}
