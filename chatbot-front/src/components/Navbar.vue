<template>
  <div>
    <n-layout-header bordered class="nav">
      <n-text tag="div" class="logo" @click="$router.push('/')">
        <Logo />
      </n-text>
      <h2 style="margin: auto 20px auto auto;">
        Olá, {{ user.name }}!
      </h2>
      <n-popover
        style="padding: 0;"
        placement="bottom-end"
        display-directive="show"
        trigger="click"
      >
        <template #trigger>
          <n-icon-wrapper :size="24" :border-radius="10" :color="'#000'" style="margin-left: auto">
            <PersonIcon />
          </n-icon-wrapper>
        </template>
        <div style="overflow: auto; max-height: 79vh">
          <n-menu
            :options="menuOptions"
            :on-update:value="menuUpdated"
          />
        </div>
      </n-popover>
    </n-layout-header>
    <n-modal v-model:show="showProfileModal">
      <n-card
        style="width: 600px"
        title="Perfil"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-descriptions label-placement="left" :columns="1">
          <n-descriptions-item label="Nome">
            {{ user.name }}
          </n-descriptions-item>
          <n-descriptions-item label="E-mail">
            {{ user.email }}
          </n-descriptions-item>
          <n-descriptions-item label="Usuário">
            {{ user.username }}
          </n-descriptions-item>
          <n-descriptions-item label="Admin">
            <n-tag :type="user.isAdmin? 'success' : 'error'">
              {{ user.isAdmin? 'Sim' : 'Não' }}
            </n-tag>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { NIcon } from 'naive-ui';
import { h } from 'vue';
import {
  LogOutOutline as LogOutOutIcon,
  Person as PersonIcon,
} from '@vicons/ionicons5';
import Logo from './Logo.vue';

const user = {
  username: 'eduardoferro',
  name: 'eduardo',
  email: 'eduardo@mail.com',
  isAdmin: true,
};

export default {
  components: {
    PersonIcon,
    Logo,
  },
  setup() {
    return {
      user,
    };
  },
  data() {
    function renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }
    const menuOptions = [
      {
        label: 'Editar perfil',
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
      menuOptions,
      showProfileModal: false,
    };
  },
  methods: {
    menuUpdated(key) {
      if (key === 'edit-profile') {
        this.showProfileModal = true;
      } else if (key === 'logout') {
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
  grid-template-columns: auto 1fr auto;
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

.nav-end {
  display: flex;
  align-items: center;
}
</style>
