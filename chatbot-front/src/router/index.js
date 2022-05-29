import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: {
        auth: true,
      },
    },
    {
      path: '/category',
      name: 'Category',
      component: () => import('../views/Category.vue'),
      meta: {
        auth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.name === 'Login' && userStore.isAuthenticated) {
    next({ name: 'Home' });
  }

  if (to.matched.some(record => record.meta.auth)) {
    if (!userStore.isAuthenticated) {
      next({
        name: 'Login',
        query: {
          unAuthenticated: true,
        },
      });
    } else {
      next();
    }
  }
  next();
});

export default router;
