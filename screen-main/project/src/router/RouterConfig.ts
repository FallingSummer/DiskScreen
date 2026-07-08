import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '@/views/IndexView.vue';
import MobileView from '@/views/MobileView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Index', component: IndexView },
    { path: '/mobile', name: 'Mobile', component: MobileView },
  ],
});

export default router;
