/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    token: undefined,
    name: undefined,
    email: undefined,
  }),
  actions: {
    setUserData(data) {
      this.updateToken(data.token);
      this.name = data.name;
      this.email = data.email;
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
