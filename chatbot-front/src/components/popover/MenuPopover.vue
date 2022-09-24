<template>
  <n-popover
    style="padding: 0;"
    placement="bottom-end"
    display-directive="show"
    trigger="click"
  >
    <template #trigger>
      <n-button type="info" strong secondary circle>
        <template #icon>
          <MenuIcon />
        </template>
      </n-button>
    </template>
    <n-menu
      :value="$route.meta.label"
      :options="menuOptions"
      :on-update:value="onValueUpdated"
    />
  </n-popover>
</template>

<script>
import {
  MenuOutline as MenuIcon,
} from '@vicons/ionicons5';
import MenuOptions from '../../helper/MenuOptions';

export default {
  components: {
    MenuIcon,
  },
  emits: ['value-updated'],
  setup() {
    return {
      menuOptions: MenuOptions.navOptions(false),
    };
  },
  methods: {
    onValueUpdated(key) {
      this.$emit('value-updated', key);
    },
  },
};
</script>

<style>

</style>
