/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    apiUrl: import.meta.env.VITE_API_URL,
    alerts: [],
    data: {},
    breadcrumbNavigation: [],
  }),
  getters: {
    getCurrentCategory() {
      return this.data.currentCategory;
    },
  },
  actions: {
    pushNavigation(name, path) {
      this.breadcrumbNavigation.push({
        name,
        path,
      });
    },
    popNavigation() {
      this.breadcrumbNavigation.pop();
    },
    clearNavigation() {
      this.breadcrumbNavigation = [];
    },
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
