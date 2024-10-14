import { config } from 'dotenv';
import * as process from 'process';
import type { z } from 'zod';

import { UnknownZodObjectSchema } from './types';

/**
 * This class is the base class for this module.
 * It will read the .env file and parse it using the `zod` schema provided by the consumer.
 */
export class ZodConfigStatic<Schema extends UnknownZodObjectSchema> {
  private readonly config: z.infer<Schema>;

  constructor(schema: Schema) {
    let configObject = process.env;

    // Override the environment variables obtained from `process.env`
    // with the ones obtained from the `.env` file, if it exists.
    try {
      configObject = {
        ...configObject,
        // TODO: allow the consumer to pass the path to the `.env` file
        ...config().parsed,
      };
    } catch (error) {
      throw new Error(`Error parsing .env file`);
    }

    this.config = schema.parse(configObject) as z.infer<Schema>;

    // adds zod default values to the process.env object
    for (const key in this.config) {
      if (process.env[key] === undefined || process.env[key] === '') {
        // notice that process.env only accepts string values
        process.env[key] = String(this.config[key] ?? '');
      }
    }
  }

  get<K extends keyof z.infer<Schema>>(key: K): z.infer<Schema>[K] {
    return this.config[key];
  }
}
