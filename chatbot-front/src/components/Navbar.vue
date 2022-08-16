<template>
  <div>
    navbar
  </div>
</template>
<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import { getCurrentInstance } from 'vue';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';
import ToggleMode from './ToggleMode.vue';
import Validator from '../helper/ValidatorHelper';

export default {
  components: {
  },
  setup() {
    return {
    };
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
<style>
</style>
