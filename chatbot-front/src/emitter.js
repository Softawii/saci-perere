import mitt from 'mitt';

const emitter = mitt();

export default function (app, options) {
  app.config.globalProperties.$emitter = emitter;
}
