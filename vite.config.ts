import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  root: './src/map',
  plugins: [vue(), viteSingleFile()],
  build: {
    outDir: 'builtMap', // Output directory relative to root
  },
})
