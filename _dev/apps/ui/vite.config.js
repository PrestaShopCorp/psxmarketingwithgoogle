import { defineConfig } from 'vite';
import { createVuePlugin as vue } from "vite-plugin-vue2";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: '$1',
      },
    ],
    // TODO: to remove as soon as we made sure that all import have the .vue extension
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
  },
  define: {
    'process.env': process.env
  },
  build: {
    /*lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'Marketing with Google',
      formats: ['es'],
      fileName: () => 'js/app.js',
    },*/
    outDir: '../../../views/',
    publicPath: process.env.VITE_ASSETS_URL || '../modules/psxmarketingwithgoogle/views/',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        sourcemap: !!process.env.GENERATE_SOURCEMAPS,
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: function (file) {
          return ['svg', 'png'].includes(file.name.split('.').pop())
            ? 'img/[name].[ext]'
            : '[ext]/[name].[ext]';
          },

      }
    },
  }
  // TODO: Move rules used to create build files in the proper folder
  // + remove test attributes in production mode
  // from vue.config.js
});
