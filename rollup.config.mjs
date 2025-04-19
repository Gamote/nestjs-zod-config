import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

import packageJson from "./package.json" with { type: "json" };
const input = "src/index.ts";
const dist = "dist";
const external = ["@nestjs/common", "@nestjs/config", "zod", "dotenv"];

export default defineConfig([
  {
    input,
    external,
    output: [
      {
        file: packageJson.main,
        format: "cjs",
      },
      {
        file: packageJson.module,
        format: "es",
      },
    ],
    plugins: [typescript(), resolve(), terser()],
  },
  {
    input,
    external,
    output: {
      file: packageJson.types,
      format: "es",
    },
    plugins: [resolve(), dts()],
  },
]);
