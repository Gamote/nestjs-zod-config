import { z } from 'zod';

/**
 * This is a utility function that can be used to coerce a string value to a boolean in a safe manner.
 *
 * Normally you will do: `z.coerce.boolean()` but this will also coerce the string `'false'` to `true`.
 * So instead we use this function to only allow the string `'false'` to be coerced to `false` and everything else will throw an error.
 *
 * @see https://github.com/colinhacks/zod/issues/1630
 */
export const safeBooleanCoerce = z.union([z.boolean(), z.string()]).transform((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error('Invalid boolean value');
});
