/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: useStorage('isAuthenticated', false),
    token: useStorage('token', undefined),
    name: undefined,
    username: undefined,
    email: undefined,
  }),
  actions: {
    setUserDetails(data) {
      this.name = data.name;
      this.email = data.email;
      this.username = data.username;
    },
    updateToken(token) {
      this.token = token;
      this.isAuthenticated = true;
    },
    async clearCredentials() {
      this.token = undefined;
      this.isAuthenticated = false;
    },
  },
});
