<template>
  <n-button strong secondary circle @click="toggle">
    <template #icon>
      <n-icon v-if="toggled" :size="size" :component="SunnyIcon" />
      <n-icon v-else :size="size" :component="MoonIcon" />
    </template>
  </n-button>
</template>

<script>
import { getCurrentInstance } from 'vue';
import {
  Sunny as SunnyIcon,
  Moon as MoonIcon,
} from '@vicons/ionicons5';
import { useUserStore } from '../store/UserStore';

export default {
  props: {
    size: {
      type: Number,
      default: 40,
    },
  },
  setup() {
    const app = getCurrentInstance();
    const userStore = useUserStore();

    return {
      userStore,
      app,
      SunnyIcon,
      MoonIcon,
    };
  },
  data() {
    return {
      toggled: false,
    };
  },
  watch: {
    toggled(novo) {
      this.userStore.isDarkMode = novo;
    },
  },
  beforeMount() {
    this.toggled = this.userStore.isDarkMode;
  },
  methods: {
    toggle() {
      this.toggled = !this.toggled;
    },
    getMode(check) {
      return check ? 'dark' : 'light';
    },
  },
};
</script>

<style>

</style>
