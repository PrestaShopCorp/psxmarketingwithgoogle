import { defineConfig } from 'vite';
import { createVuePlugin as vue } from "vite-plugin-vue2";
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import VitePluginReactRemoveAttributes from 'vite-plugin-react-remove-attributes';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    VitePluginReactRemoveAttributes({
      attributes: ['data-test-id'],
    }),
    {
      name: 'asset-path-fixer',
      enforce: 'post',
      apply: 'serve',
      transform: (code) => {
        return {
          code: code.replaceAll(/\/src\/assets/g, 'http://localhost:5173/src/assets'),
          map: null,
        };
      },
    },
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
    outDir: '../../../views/',
    publicPath: process.env.VITE_ASSETS_URL || '../modules/psxmarketingwithgoogle/views/',
    emptyOutDir: false,
    rollupOptions: {
      input: [
        'src/main.ts',
        'src/bc-ante-vite.ts',
      ],
      output: {
        sourcemap: !!process.env.GENERATE_SOURCEMAPS,
        entryFileNames: (chunkInfo) => {
          // Since we migrated on Vite, type="module" is necessary to load the UI.
          // -> To be backward compliant, an app.js remains and includes the new entrypoint in the DOM the proper way.
          // -> On the module side, the new entry point will be loaded directly.
          if (chunkInfo.name === 'bc-ante-vite') {
            return 'js/app.js';
          }
          return 'js/psxmarketingwithgoogle-ui.js';
        },
        chunkFileNames: 'js/[name].js',
        assetFileNames: function (file) {
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
          } else if (id.includes('bc-ante-vite')) {
            return 'app';
          }
        },
      }
    },
  },
  test: {
    globals: true,
  },
}));
