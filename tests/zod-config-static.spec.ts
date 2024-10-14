import { it, describe, expect } from 'vitest';
import { z } from 'zod';

import { ZodConfigStatic } from '../src/zod-config-static';

describe('zod-config-static', () => {
  it('should add the schema defaults to process.env', () => {
    const ConfigSchema = z.object({
      SOME_VAR_WITH_DEFAULT: z.string().default('a default value'),
    })

    expect(process.env.SOME_VAR_WITH_DEFAULT).toBeUndefined();

    const config = new ZodConfigStatic(ConfigSchema);

    expect(process.env.SOME_VAR_WITH_DEFAULT).toBe('a default value');
  });

  it('should add the schema defaults to process.env, coercing to string if needed', () => {
    const ConfigSchema = z.object({
      OTHER_VAR_WITH_DEFAULT: z.coerce.number().default(42),
    })

    expect(process.env.OTHER_VAR_WITH_DEFAULT).toBeUndefined();

    const config = new ZodConfigStatic(ConfigSchema);

    expect(config.get('OTHER_VAR_WITH_DEFAULT')).toBe(42);
    expect(process.env.OTHER_VAR_WITH_DEFAULT).toBe('42');
  });
});
