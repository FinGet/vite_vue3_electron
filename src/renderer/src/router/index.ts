import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/home',
    component: () => import('@renderer/views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('@renderer/views/About.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
