<template>
  <div v-if="$route.meta.label !== 'login' && !isMobile">
    <n-space vertical>
      <n-layout id="sidebar" has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          show-trigger
        >
          <n-menu
            :options="menuOptions"
            :value="$route.meta.label"
            :on-update:value="menuUpdated"
          />
        </n-layout-sider>
        <n-layout>
          <slot />
        </n-layout>
      </n-layout>
    </n-space>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import MenuOptions from '../helper/MenuOptions';

export default {
  emits: ['menu-updated'],
  setup() {
    window.$message = useMessage();
    const router = useRouter();
    return {
      isMobile: ref(window.innerWidth < 1024),
      menuOptions: MenuOptions.navOptions(router),
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1024;
    });
  },
  methods: {
    menuUpdated(key) {
      this.$emit('menu-updated', key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

#sidebar {
  height: calc(100vh - $nav-height);
}
</style>
