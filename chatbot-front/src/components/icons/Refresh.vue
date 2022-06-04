<template>
  <svg
    id="icon" :class="{animate: animated}" style="width:24px;height:24px" viewBox="0 0 24 24"
    @click.stop="animate"
  >
    <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
  </svg>
</template>

<script>
export default {
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
