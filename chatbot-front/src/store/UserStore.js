/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    token: undefined,
  }),
  actions: {
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
