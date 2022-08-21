<template>
  <n-space vertical>
    <n-layout has-sider style="height: 100vh;">
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
</template>

<script>
import { NIcon } from 'naive-ui';
import {
  PersonAdd as PersonAddIcon,
  PeopleOutline as PeopleIcon,
  Newspaper as NewspaperIcon,
} from '@vicons/ionicons5';
import { h } from 'vue';

export default {
  emits: ['menu-updated'],
  setup() {
    function renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }
    const menuOptions = [
      {
        label: 'Categorias',
        key: 'categories',
        href: '/categories',
        icon: renderIcon(NewspaperIcon),
      },
      {
        label: 'Usuários',
        key: 'users',
        href: '/users',
        icon: renderIcon(PeopleIcon),
      },
      {
        label: 'Cadastrar Usuário',
        key: 'new-user',
        href: '/users',
        icon: renderIcon(PersonAddIcon),
      },
    ];

    return {
      menuOptions,
    };
  },
  methods: {
    menuUpdated(key) {
      this.$emit('menu-updated', key);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
