<script setup>
</script>

<template>
  <div class="_background" style="min-height: 100vh; min-width: 100vw;">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <n-space vertical>
          <n-layout-header>
            <Navbar />
          </n-layout-header>
          <n-layout-content>
            <Sidebar @menu-updated="changeRoute">
              <component :is="Component" :key="$route.name" />
            </Sidebar>
          </n-layout-content>
        </n-space>
      </transition>
    </router-view>
  </div>
</template>
<script>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  components: {
    Navbar,
    Sidebar,
  },
  setup() {
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
