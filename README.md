# NestJS Zod Config

[![NPM version](https://img.shields.io/npm/v/nestjs-zod-config.svg?style=flat)](https://www.npmjs.com/package/nestjs-zod-config)
[![NPM downloads](https://img.shields.io/npm/dm/nestjs-zod-config.svg?style=flat)](https://www.npmjs.com/package/nestjs-zod-config)
![Fastify](https://img.shields.io/badge/-Vitest-86b91a?style=flat&logo=vitest&logoColor=white)

**nestjs-zod-config** - NestJS module to load, type and validate configuration using Zod.

## Installation

```bash
yarn add nestjs-zod-config
```
> Peer dependencies: `yarn add @nestjs/common @nestjs/core zod`

## Setup

1. Have a `.env` file in the root of your project.
    ```dotenv
    # .env
    PORT=3000
    ```

2. Create a config class that extends `ZodConfig` and pass it a Zod schema.
    ```ts
    // app.config.ts
    import { ZodConfig } from 'nestjs-zod-config';
    import { z } from 'zod';
    
    const appConfigSchema = z.object({
      HOSTNAME: z.string().min(1).default('0.0.0.0'),
      PORT: z.coerce.number().default(3000),
    });
    
    export class AppConfig extends ZodConfig(appConfigSchema) {}
    ```

3. Register the config class in your module.
    ```ts
    // app.module.ts
    import { Module } from '@nestjs/common';
    import { ZodConfigModule } from 'nestjs-zod-config';
    import { AppConfig } from './app.config';
    
    @Module({
      imports: [
        ZodConfigModule.forRoot({
          service: AppConfig,
        }),
      ],
    })
    export class AppModule {}
    ```

## Usage

Use it in your service like this:

```ts
// app.service.ts
import { Injectable } from '@nestjs/common';
import { AppConfig } from './app.config';

@Injectable()
export class AppService {
  constructor(private readonly appConfig: AppConfig) {}
  
  getPort(): number {
    return this.appConfig.get('PORT');
  }
}
```

or in your `main.ts` like this:

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';

const main = async () => {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfig);

  const hostname = appConfig.get('HOSTNAME');
  const port = appConfig.get('PORT');

  await app.listen(port, hostname);
};

void main();
```

## Testing

```bash
yarn test
```
