<template>
  <div>
    Category
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';
import DotsVertical from '../components/icons/DotsVertical.vue';
import Refresh from '../components/icons/Refresh.vue';
import Selection from '../components/Selection.vue';

export default {
  components: {
    DotsVertical,
    Refresh,
    Selection,
  },
  data() {
    return {
    };
  },
  computed: {
  },
  beforeMount() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
