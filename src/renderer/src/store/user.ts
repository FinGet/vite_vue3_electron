import { defineStore } from 'pinia';
import { User } from '@renderer/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    info: {} as User | null,
    token: ''
  }),
  actions: {
    setInfo(info: User) {
      this.info = info;
    },
    removeToken() {
      this.token = '';
    }
  },
  persist: {
    key: '__prompt_user',
    storage: localStorage
  }
});
