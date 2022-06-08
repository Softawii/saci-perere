<template>
  <!-- eslint-disable-next-line vue/v-on-event-hyphenation -->
  <i-toggle v-model="toggled" @update:modelValue="toggle" />
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useUserStore } from '../store/UserStore';

export default {
  setup() {
    const app = getCurrentInstance();
    const userStore = useUserStore();

    return {
      userStore,
      app,
    };
  },
  data() {
    return {
      toggled: false,
    };
  },
  watch: {
    toggled(novo) {
      console.log(novo);
      this.set(this.getMode(novo));
      this.userStore.isDarkMode = novo;
    },
  },
  beforeMount() {
    this.toggled = this.userStore.isDarkMode;
    this.set(this.getMode(this.toggled));
  },
  methods: {
    toggle() {
      const app = this.app;
      const current = app.appContext.config.globalProperties.$inkline.options.colorMode;
      if (current === 'dark') app.appContext.config.globalProperties.$inkline.options.colorMode = 'light';
      else app.appContext.config.globalProperties.$inkline.options.colorMode = 'dark';
    },
    set(mode) {
      this.app.appContext.config.globalProperties.$inkline.options.colorMode = mode;
    },
    getMode(check) {
      return check ? 'dark' : 'light';
    },
  },
};
</script>

<style>

</style>
