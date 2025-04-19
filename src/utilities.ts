import { z } from 'zod';

/**
 * This is a utility function that can be used to coerce a string value to a boolean safely.
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

/**
 * This is a utility function that can be used to parse a comma-delimited string to an array of strings.
 */
export const commaDelimitedArray = z.preprocess((input, ctx) => {
  if (typeof input === 'string') {
    return input.split(',').map((s) => s.trim());
  }

  ctx.addIssue({ code: 'custom', message: 'Invalid comma delimited array - must be a string' });
  return z.NEVER;
}, z.array(z.string()).min(1));

/**
 * This is a utility function that can be used to transform a JSON string into an object.
 */
export const jsonStringCoerce = z.string().transform((input, ctx) => {
  try {
    return JSON.parse(input);
  } catch (e) {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON string - cannot be parsed' });
    return z.NEVER;
  }
});

/**
 * Strict coerce a string to a date.
 *
 * This is used because, when using `z.coerce.date()`, we get unexpected results.
 * For example, `z.coerce.date().parse(null)` returns `1970-01-01T00:00:00.000Z`,
 * which may not be the desired behavior in many cases.
 *
 * This is useful in DTOs where `null` or `undefined` may be passed,
 * but their resolution to a date is not desired.
 *
 * @see https://github.com/colinhacks/zod/discussions/2103#discussioncomment-8683418
 */
export const strictCoerceStringDate = z.string().pipe(z.coerce.date());
