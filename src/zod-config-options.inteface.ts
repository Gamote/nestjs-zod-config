import type { URL } from "node:url";

export interface ZodConfigOptions {
  /**
   * Path to the .env file(s)
   * @default '.env'
   */
  envFilePath?: string | string[] | URL;
}
