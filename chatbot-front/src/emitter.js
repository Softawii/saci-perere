import mitt from 'mitt';

const emitter = mitt();

export default function (app, options) {
  // eslint-disable-next-line no-param-reassign
  app.config.globalProperties.$emitter = emitter;
}
