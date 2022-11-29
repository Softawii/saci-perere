import { createApp } from 'vue';
import { createPinia } from 'pinia';
import naive from 'naive-ui';
import emitter from './emitter';
import App from './App.vue';
import router from './router';

import './variables.scss';
// eslint-disable-next-line import/no-unresolved
import 'virtual:fonts.css';

createApp(App)
  .use(naive)
  .use(createPinia())
  .use(router)
  .use(emitter)
  .mount('#app');
