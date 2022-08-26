<script setup>
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="_background" style="height: 100vh; width: 100vw;">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <div>
            <n-layout-header>
              <Navbar v-if="$route.meta.label !== 'login'" />
            </n-layout-header>
            <n-layout-content>
              <Sidebar @menu-updated="changeRoute">
                <component :is="Component" :key="$route.name" />
              </Sidebar>
            </n-layout-content>
          </div>
        </transition>
      </router-view>
    </div>
  </n-config-provider>
</template>
<script>
import { darkTheme } from 'naive-ui';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  components: {
    Navbar,
    Sidebar,
  },
  setup() {
    return {
      darkTheme,
    };
  },
  beforeMount() {
  },
  methods: {
    changeRoute(key) {
      this.$router.push(`/${key}`);
    },
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
