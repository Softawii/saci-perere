import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteFonts from 'vite-plugin-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteFonts({
      custom: {
        families: [
          {
            name: 'Roboto',
            local: 'Roboto',
            src: './src/assets/fonts/Roboto/*.ttf',
          },
          {
            name: 'JetBrainsMono',
            local: 'JetBrainsMono',
            src: './src/assets/fonts/JetBrainsMono/*.woff2',
          },
        ],
        display: 'auto',
        preload: false,
        prefetch: false,
      },
    }),
  ],
});
