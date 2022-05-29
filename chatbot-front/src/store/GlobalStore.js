/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    apiUrl: import.meta.env.VITE_API_URL,
  }),
});
