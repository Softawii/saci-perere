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
      meta: {
        label: 'login',
      },
    },
    {
      path: '/',
      name: 'Home',
      redirect: to => ({ name: 'Categories' }),
      meta: {
        auth: true,
        label: 'home',
      },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('../views/Categories.vue'),
      meta: {
        auth: true,
        label: 'categories',
      },
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: () => import('../views/Category.vue'),
      meta: {
        auth: true,
        label: 'category',
      },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users.vue'),
      meta: {
        auth: true,
        label: 'users',
      },
    },
    {
      path: '/faq/',
      name: 'FAQ',
      component: () => import('../views/OpenFAQ.vue'),
      meta: {
        auth: false,
        label: 'faq',
      },
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();

//   if (to.name === 'Login' && userStore.isAuthenticated) {
//     next({ name: 'Home' });
//   }

//   if (to.matched.some(record => record.meta.auth)) {
//     if (!userStore.isAuthenticated) {
//       next({
//         name: 'Login',
//         query: {
//           unAuthenticated: true,
//         },
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
