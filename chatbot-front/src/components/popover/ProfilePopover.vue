<template>
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
    <n-menu
      :options="navUserMenuOptions"
      :on-update:value="onValueUpdated"
    />
  </n-popover>
</template>

<script>
import {
  PersonOutline as PersonIcon,
} from '@vicons/ionicons5';
import MenuOptions from '../../helper/MenuOptions';

export default {
  components: {
    PersonIcon,
  },
  emits: ['value-updated'],
  setup() {
    return {
      navUserMenuOptions: MenuOptions.navUserMenuOptions,
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
