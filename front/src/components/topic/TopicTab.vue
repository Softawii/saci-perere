<template>
  <n-card style="margin-bottom: 16px">
    <n-tabs type="line" animated :on-update:value="valueUpdated">
      <n-tab-pane name="all" tab="Todos">
        <slot />
      </n-tab-pane>
      <n-tab-pane name="favorites" tab="Favoritos">
        <slot />
      </n-tab-pane>
      <n-tab-pane name="new-topic" tab="Novo Tópico" :disabled="!userStore.profile.isadmin">
        <slot />
      </n-tab-pane>
      <template #suffix>
        <RefreshButton @click="refresh" />
      </template>
    </n-tabs>
  </n-card>
</template>

<script>
import { useUserStore } from '../../store/UserStore';
import RefreshButton from '../RefreshButton.vue';

export default {
  components: { RefreshButton },
  emits: ['updated'],
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  methods: {
    valueUpdated(key) {
      this.$emit('updated', key);
    },
    refresh() {
      this.$emitter.emit('refreshTopics');
    },
  },
};
</script>

<style>

</style>
