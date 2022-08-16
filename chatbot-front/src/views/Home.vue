<template>
  <div class="">
    Home
    <n-space>
      <n-button>Default</n-button>
      <n-button type="tertiary">
        Tertiary
      </n-button>
      <n-button type="primary">
        Primary
      </n-button>
      <n-button type="info">
        Info
      </n-button>
      <n-button type="success">
        Success
      </n-button>
      <n-button type="warning">
        Warning
      </n-button>
      <n-button type="error">
        Error
      </n-button>
    </n-space>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';
import DotsVertical from '../components/icons/DotsVertical.vue';
import Refresh from '../components/icons/Refresh.vue';

export default {
  components: {
    DotsVertical,
    Refresh,
  },
  setup() {
    const globalStore = useGlobalStore();
    return {
      globalStore,
    };
  },
  data() {
    return {
    };
  },
  computed: {
  },
  beforeMount() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
