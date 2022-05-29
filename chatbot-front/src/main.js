import { createApp } from 'vue';
import { Inkline, components } from '@inkline/inkline';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import '@inkline/inkline/inkline.scss';
import './main.scss';
// eslint-disable-next-line import/no-unresolved
import 'virtual:fonts.css';

createApp(App)
  .use(Inkline, {
    components,
    colorMode: 'light',
  })
  .use(createPinia())
  .use(router)
  .mount('#app');
