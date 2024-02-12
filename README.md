# NestJS Zod Config

[![NPM version](https://img.shields.io/npm/v/nestjs-zod-config.svg?style=flat)](https://www.npmjs.com/package/nestjs-zod-config)
[![NPM downloads](https://img.shields.io/npm/dm/nestjs-zod-config.svg?style=flat)](https://www.npmjs.com/package/nestjs-zod-config)
![Fastify](https://img.shields.io/badge/-Vitest-86b91a?style=flat&logo=vitest&logoColor=white)

**nestjs-zod-config** - NestJS module to load, type and validate configuration using Zod. Insied and outside the NestJS context.

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
```

> This assumes that you have a `.env` file in the root of your project or that you have set the environment variables in `process.env` in some other way.

✨ All done. Let's see how we can use it.

Then we need to register the config class in our module.

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

## Testing

```bash
yarn test
```

## Roadmap
- [ ] Provide a way to customize the env loader. Useful when different name, format or location of the env file is needed.
- [ ] Provide async methods to load the config.
- [ ] Write tests 🧪

## Tips and Tricks

### Use `safeBooleanCoerce` to coerce strings to booleans safely

This is a utility function that can be used to coerce a string value to a boolean in a strict manner.

Normally you will do: `z.coerce.boolean()` but this will also coerce the string `'false'` to `true`.
So instead we use this function to only allow `'false'` or `false` to be coerced to `false`, `'true'` or `true` to `true` and everything else will throw an error.
