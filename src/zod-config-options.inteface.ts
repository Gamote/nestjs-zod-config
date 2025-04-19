import type { URL } from 'url';

export interface ZodConfigOptions {
  /**
   * Path to the .env file(s)
   * @default '.env'
   */
  envFilePath?: string | string[] | URL;
}
