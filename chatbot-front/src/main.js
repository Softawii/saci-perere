import { createApp } from 'vue';
import { Inkline, components } from '@inkline/inkline';
import App from './App.vue';

import '@inkline/inkline/inkline.scss';
import './main.scss';
import 'virtual:fonts.css';

createApp(App)
  .use(Inkline, {
    components,
    colorMode: 'light',
  })
  .mount('#app');
