<script setup>
import axios from 'axios';
import { mapStores } from 'pinia';
import AccountIcon from '../components/icons/Account.vue';
import LockIcon from '../components/icons/Lock.vue';
import EyeIcon from '../components/icons/Eye.vue';
import EyeOffIcon from '../components/icons/EyeOff.vue';

import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';
</script>
<template>
  <div id="main" style="min-height: 100vh; display: flex; align-items: center;">
  login
  </div>
</template>

<script>

import {mapStores} from "pinia";

export default {
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
