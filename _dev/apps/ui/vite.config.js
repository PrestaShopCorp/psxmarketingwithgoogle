import { defineConfig } from 'vite';
import { createVuePlugin as vue } from "vite-plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // TODO: to remove as soon as we made sure that all import have the .vue extension
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  // TODO: Move rules used to create build files in the proper folder
  // + remove test attributes in production mode
  // from vue.config.js
});
