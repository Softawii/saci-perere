<template>
  <n-layout-header bordered class="nav">
    <n-text tag="div" class="logo">
      <Logo />
    </n-text>
    <h2 style="margin: auto 20px auto auto;">
      Olá, fulano!
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
        />
      </div>
    </n-popover>
  </n-layout-header>
</template>
<script>
import { NIcon } from 'naive-ui';
import { h } from 'vue';
import {
  LogOutOutline as LogOutOutIcon,
  Person as PersonIcon,
} from '@vicons/ionicons5';
import Logo from './Logo.vue';

export default {
  components: {
    PersonIcon,
    Logo,
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
    };
  },
};
</script>
<style>
.nav {
  --side-padding: 16px;
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

.logo > img {
  margin-right: 12px;
  height: 32px;
  width: 32px;
}

.nav-end {
  display: flex;
  align-items: center;
}
</style>
