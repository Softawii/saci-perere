<template>
  <n-list hoverable>
    <n-list-item v-for="i in count" :key="i">
      <n-thing content-style="margin-top: 10px; max-width: 500px">
        <n-skeleton text />
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 10,
    },
  },
};
</script>
