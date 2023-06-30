import { defineConfig } from 'vite';
import { createVuePlugin as vue } from "vite-plugin-vue2";
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
  ],
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
    // 'process.env': process.env,
    'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"',
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
        entryFileNames: 'js/app.js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: function (file) {
          if (file.name?.includes('index.html')) {
            console.log(file.name);
            return '';
          }
          return ['svg', 'png'].includes(file.name?.split('.')?.pop() || '')
            ? 'img/[name].[ext]'
            : '[ext]/[name].[ext]';
        },
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          } else if (id.includes('mktg-with-google-common/translations/')) {
            const splitPath = path.dirname(id).split('/');
            return `translations/${splitPath[splitPath.length -1]}`;
          }
        },
      }
    },
  },
  // TODO: Move rules used to create build files in the proper folder
  // + remove test attributes in production mode
  // from vue.config.js
}));
