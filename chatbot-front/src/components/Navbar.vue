<template>
  <div>
    <n-layout-header bordered class="nav">
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
            :options="menuOptions"
            :on-update:value="menuUpdated"
          />
        </div>
      </n-popover>
    </n-layout-header>
    <ProfileModal v-if="showProfileModal" @status="(value) => showProfileModal = value" />
  </div>
</template>

<script>
import { NIcon } from 'naive-ui';
import { h, ref } from 'vue';
import {
  LogOutOutline as LogOutOutIcon,
  PersonOutline as PersonIcon,
} from '@vicons/ionicons5';
import Logo from './Logo.vue';
import ToggleMode from './ToggleMode.vue';
import ProfileModal from './modal/ProfileModal.vue';
import { useUserStore } from '../store/UserStore';

export default {
  components: {
    PersonIcon,
    Logo,
    ToggleMode,
    ProfileModal,
  },
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    };
  },
  data() {
    function renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }
    const menuOptions = [
      {
        label: 'Perfil',
        key: 'edit-profile',
        icon: renderIcon(PersonIcon),
      },
      {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(LogOutOutIcon),
      },
    ];

    return {
      PersonIcon,
      menuOptions,
      showProfileModal: ref(false),
    };
  },
  methods: {
    menuUpdated(key) {
      if (key === 'edit-profile') {
        this.showProfileModal = true;
      } else if (key === 'logout') {
        this.userStore.clearProfile();
        this.$router.push('/login');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../variables.scss';

.nav {
  --side-padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  padding: 0 var(--side-padding);
  height: $nav-height;
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}
</style>
