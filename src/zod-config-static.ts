// Load the .env file into the process.env
import 'dotenv/config';

import type { z } from 'zod';

import { UnknownZodObjectSchema } from './types';

/**
 * This class is the base class for this module.
 * It will read the .env file and parse it using the `zod` schema provided by the consumer.
 */
export class ZodConfigStatic<Schema extends UnknownZodObjectSchema> {
  private readonly config: z.infer<Schema>;

  constructor(schema: Schema) {
    this.config = schema.parse(process.env) as z.infer<Schema>;
  }

  get<K extends keyof z.infer<Schema>>(key: K): z.infer<Schema>[K] {
    return this.config[key];
  }
}
