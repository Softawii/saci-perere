/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: useStorage('isAuthenticated', false),
    profile: useStorage('profile', {}),
    isDarkMode: useStorage('isDarkMode', true),
  }),
  actions: {
    async setUserProfile(data) {
      this.isAuthenticated = true;
      this.profile = {
        ...this.profile,
        ...data,
      };
    },
    async clearProfile() {
      this.profile = {};
      this.isAuthenticated = false;
    },
  },
});
