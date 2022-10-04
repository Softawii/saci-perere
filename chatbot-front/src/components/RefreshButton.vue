<template>
  <n-button
    :class="{animate: animated}" strong secondary
    circle @click.stop="animate"
  >
    <template #icon>
      <n-icon :component="RefreshIcon" />
    </template>
  </n-button>
</template>

<script>
import {
  Refresh as RefreshIcon,
} from '@vicons/ionicons5';

export default {
  setup() {
    return {
      RefreshIcon,
    };
  },
  data() {
    return {
      animated: false,
    };
  },
  methods: {
    animate() {
      this.animated = true;
      setTimeout(() => {
        this.animated = false;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.animate {
  animation-name: rot;
  animation-duration: 1s;
}

@keyframes rot {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
