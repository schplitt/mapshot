import { defineConfig } from 'tsdown'

export default defineConfig(
  {
    entry: ['./src/index.ts', './src/cli/index.ts'],
    format: 'esm',
    copy: {
      from: './src/map/builtMap/index.html',
      to: './dist/map/builtMap/index.html',
    },
  },
)
