<template>
  <div>
    <n-layout-header bordered class="nav">
      <n-text tag="div" class="logo" @click="$router.push('/')">
        <Logo />
      </n-text>
      <ToggleMode style="margin: auto 20px auto auto;" :size="20" />
      <div v-if="isMobile" style="margin: auto 20px auto auto">
        <MenuPopover @value-updated="navMenuUpdated" />
      </div>
      <h2 v-else style="margin: auto 20px auto auto">
        Olá, {{ userStore.profile.name }}!
      </h2>
      <ProfilePopover @value-updated="userMenuUpdated" />
    </n-layout-header>
    <ProfileModal v-if="showProfileModal" @status="(value) => showProfileModal = value" />
  </div>
</template>

<script>
import { ref } from 'vue';
import Logo from './Logo.vue';
import ToggleMode from './ToggleMode.vue';
import ProfileModal from './modal/ProfileModal.vue';
import ProfilePopover from './popover/ProfilePopover.vue';
import MenuPopover from './popover/MenuPopover.vue';
import { useUserStore } from '../store/UserStore';

export default {
  components: {
    Logo,
    ToggleMode,
    ProfileModal,
    ProfilePopover,
    MenuPopover,
  },
  emits: ['menu-updated'],
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
      isMobile: ref(window.innerWidth < 1024),
    };
  },
  data() {
    return {
      showProfileModal: ref(false),
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1024;
    });
  },
  methods: {
    userMenuUpdated(key) {
      if (key === 'edit-profile') {
        this.showProfileModal = true;
      } else if (key === 'logout') {
        this.userStore.clearProfile();
        this.$router.push('/login');
      }
    },
    navMenuUpdated(key) {
      this.$emit('menu-updated', key);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../variables.scss';

.nav {
  height: $nav-height;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  --x-padding: 16px;
  padding: 0 var(--x-padding);
  &.mobile {
  --x-padding: 8px;
  padding: 0 var(--x-padding);
  }
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}
</style>
