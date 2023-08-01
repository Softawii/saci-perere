/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    apiUrl: import.meta.env.VITE_API_URL,
    alerts: [],
    data: {},
  }),
  getters: {
    getCurrentCategory() {
      return this.data.currentCategory;
    },
  },
  actions: {
    addAlert(alert) {
      this.alerts.push(alert);
    },
    clearAlerts() {
      this.alerts = [];
    },
    setCurrentCategory(category) {
      this.data.currentCategory = category;
    },
  },
});
