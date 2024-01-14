import type { z } from 'zod';

// I don't like `any` but we need it, so it doesn't complain about the consumer's side
export type UnknownRecord = Record<any, unknown>;

export type UnknownZodSchema = z.ZodType<UnknownRecord>;
