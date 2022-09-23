<template>
  <div class="nav">
    <div v-if="isMobile" class="mobile">
      <n-text tag="div" class="logo" @click="$router.push('/')">
        <Logo />
      </n-text>
      <n-popover
        style="padding: 0"
        placement="bottom-end"
        display-directive="show"
        trigger="click"
      >
        <template #trigger>
          <n-icon size="20" style="margin: 0 20px 0 auto;">
            <MenuIcon />
          </n-icon>
        </template>
        <div style="overflow: auto; max-height: 79vh">
          <n-menu
            :value="$route.meta.label"
            :options="menuOptions"
            :on-update:value="navMenuUpdated"
          />
        </div>
      </n-popover>
      <n-popover
        style="padding: 0;"
        placement="bottom-end"
        display-directive="show"
        trigger="click"
      >
        <template #trigger>
          <n-button strong secondary circle>
            <template #icon>
              <PersonIcon />
            </template>
          </n-button>
        </template>
        <div style="overflow: auto; max-height: 79vh">
          <n-menu
            :options="navUserMenuOptions"
            :on-update:value="userMenuUpdated"
          />
        </div>
      </n-popover>
    </div>
    <div v-else>
      <n-layout-header bordered class="desktop">
        <n-text tag="div" class="logo" @click="$router.push('/')">
          <Logo />
        </n-text>
        <ToggleMode style="margin: auto 20px auto auto;" :size="20" />
        <h2 style="margin: auto 20px auto auto; grid">
          Olá, {{ userStore.profile.name }}!
        </h2>
        <n-popover
          style="padding: 0;"
          placement="bottom-end"
          display-directive="show"
          trigger="click"
        >
          <template #trigger>
            <n-button strong secondary circle>
              <template #icon>
                <PersonIcon />
              </template>
            </n-button>
          </template>
          <div style="overflow: auto; max-height: 79vh">
            <n-menu
              :options="navUserMenuOptions"
              :on-update:value="userMenuUpdated"
            />
          </div>
        </n-popover>
      </n-layout-header>
    </div>
    <ProfileModal v-if="showProfileModal" @status="(value) => showProfileModal = value" />
  </div>
</template>

<script>
import { ref } from 'vue';
import {
  PersonOutline as PersonIcon,
  MenuOutline as MenuIcon,
} from '@vicons/ionicons5';
import Logo from './Logo.vue';
import ToggleMode from './ToggleMode.vue';
import ProfileModal from './modal/ProfileModal.vue';
import { useUserStore } from '../store/UserStore';
import MenuOptions from '../helper/MenuOptions';

export default {
  components: {
    PersonIcon,
    Logo,
    ToggleMode,
    ProfileModal,
    MenuIcon,
  },
  emits: ['menu-updated'],
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
      isMobile: ref(window.innerWidth < 1024),
      menuOptions: MenuOptions.navOptions(false),
    };
  },
  data() {
    return {
      navUserMenuOptions: MenuOptions.navUserMenuOptions,
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
}

.nav .desktop {
  --side-padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  padding: 0 var(--side-padding);
}
.nav .mobile {
  --side-padding: 8px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  padding: 0 var(--side-padding);
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}
</style>
