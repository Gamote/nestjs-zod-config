# NestJS Zod Config

[![NPM version](https://img.shields.io/npm/v/nestjs-zod-config.svg?style=flat)](https://www.npmjs.com/package/nestjs-zod-config)
[![NPM downloads](https://img.shields.io/npm/dm/nestjs-zod-config.svg?style=flat)](https://www.npmjs.com/package/nestjs-zod-config)
![Fastify](https://img.shields.io/badge/-Vitest-86b91a?style=flat&logo=vitest&logoColor=white)

**nestjs-zod-config** - NestJS module to load, type and validate configuration using Zod. Inside and outside the NestJS context.

We are also providing some handy utility functions. ✨

## Installation

```bash
yarn add nestjs-zod-config
```
> Peer dependencies: `yarn add @nestjs/common zod`

## Setup

The first thing that we need to do is to create a config class that extends `ZodConfig` and pass it our Zod schema.

```ts
// app.config.ts
import { ZodConfig } from 'nestjs-zod-config';
import { z } from 'zod';

const appConfigSchema = z.object({
   HOSTNAME: z.string().min(1).default('0.0.0.0'),
   PORT: z.coerce.number().default(3000),
});

export class AppConfig extends ZodConfig(appConfigSchema) {}

// You can also pass a custom path to the .env file(s)
export class AppConfig extends ZodConfig(appConfigSchema, {
  envFilePath: '.env.custom'
})
```

> By default, this assumes that you have a `.env` file in the root of your project or that you have set the environment variables in `process.env` in some other way. You can customize the path to the .env file using the `envFilePath` option.

✨ All done. Let's see how we can use it.

## Usage

### Inside NestJS context

We will have to register the config class in a module:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ZodConfigModule } from 'nestjs-zod-config';
import { AppConfig } from './app.config';

@Module({
   imports: [
     ZodConfigModule.forRoot({
       config: AppConfig,
       isGlobal: true, // optional, defaults to `false`
     }),
   ],
})
export class AppModule {}
```

> It is recommended to register the config class in the root module of your application.

Now we can inject `AppConfig` in your services like this:

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

or in our `main.ts`, like this:

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

### Outside NestJS context

There are cases where we need to access the config outside the NestJS context. For example, we might want to use the config in a seeder script:

```ts
// seed.ts
import { loadZodConfig } from 'nestjs-zod-config';

const seedDb = async () => {
  const appConfig = loadZodConfig(AppConfig);

  const databaseurl = appConfig.get('DATABASE_URL');

  // use the `databaseurl` to connect to the database and seed it
};
```

> In this case we cannot inject the `AppConfig` and we don't have access to the `app` instance. The file is executed outside the NestJS context.

## Utility functions

### Use `safeBooleanCoerce` to coerce strings to booleans safely

This is a utility function that can be used to coerce a string value to a boolean in a strict manner.

Normally you will do: `z.coerce.boolean()` but this will also coerce the string `'false'` to `true`.
So instead we use this function to only allow `'false'` or `false` to be coerced to `false`, `'true'` or `true` to `true` and everything else will throw an error.

### Use `commaDelimitedArray` to parse comma-separated strings into arrays

This is a utility function that can be used to parse a comma-delimited string into an array of strings.

It's particularly useful when dealing with environment variables that contain multiple values separated by commas. For example, you might have an environment variable like `ALLOWED_ORIGINS=http://localhost:3000,https://example.com` that you want to parse into an array.

```ts
// In your schema
const configSchema = z.object({
  ALLOWED_ORIGINS: commaDelimitedArray,
});

// When parsed, this will transform "http://localhost:3000,https://example.com" into:
// ["http://localhost:3000", "https://example.com"]
```

The function trims whitespace from each item and ensures the array contains at least one element. If the input is not a string, it will throw a validation error.

### Use `strictCoerceStringDate` for strict date coercion

This is a utility function that can be used to coerce a string to a date in a strict manner.

When using `z.coerce.date()`, you might get unexpected results. For example, `z.coerce.date().parse(null)` returns `1970-01-01T00:00:00.000Z`, which may not be the desired behavior in many cases.

This utility is particularly useful in DTOs where `null` or `undefined` may be passed, but their resolution to a date is not desired. It ensures that only valid string representations of dates are coerced to Date objects.

## Testing

```bash
yarn test
```
