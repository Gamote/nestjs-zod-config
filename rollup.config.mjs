import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.ts';
const dist = 'dist';
const external = [
  "@nestjs/common",
  "@nestjs/config",
  "zod",
];

// TODO: Remove `rimraf -rf dist && rollup -c`

export default defineConfig([{
  input,
  external,
  output: [
    {
      file: `${dist}/index.cjs.js`,
      format: 'cjs',
    },
    {
      file: `${dist}/index.esm.js`,
      format: 'es',
    }
  ],
  plugins: [typescript(), terser()],
}, {
  input,
  external,
  output: {
    dir: dist,
    format: 'es',
  },
  plugins: [dts()],
}]);
