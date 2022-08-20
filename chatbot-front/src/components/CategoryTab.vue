<template>
  <n-card style="margin-bottom: 16px">
    <n-tabs type="line" animated :on-update:value="valueUpdated">
      <n-tab-pane name="all" tab="Todas">
        <slot />
      </n-tab-pane>
      <n-tab-pane name="favorites" tab="Favorites">
        <slot />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script>
export default {
  emits: ['updated'],
  methods: {
    valueUpdated(key) {
      this.$emit('updated', key);
    },
  },
};
</script>

<style>

</style>
