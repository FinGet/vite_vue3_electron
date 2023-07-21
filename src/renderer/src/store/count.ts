import { defineStore } from 'pinia';

const useCounter = defineStore('count', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++;
      console.log(this.count);
    },
    decrement() {
      this.count--;
    }
  }
});

export default useCounter;
