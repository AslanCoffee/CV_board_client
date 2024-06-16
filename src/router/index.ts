import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '../views/MainView.vue';
import Log from '../views/LogView.vue';
import Users from '../views/UsersView.vue';
import store from '../request/index'; // Импортируем Vuex store

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: Main,
    meta: { requiresAuth: true } // Требует авторизации
  },
  {
    path: '/log',
    name: 'log',
    component: Log // Не требует авторизации
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true, requiredRole: 'ADMIN' } // Требует авторизации и роли 'admin'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Глобальный передохранитель для проверки авторизации и ролей
// router.beforeEach(async (to, from, next) => {
//   await store.dispatch("mAuth/authenticate");
//   const isAuthenticated = store.getters['mAuth/isAuthenticated'];
//   const userRole = store.getters['mAuth/userRole'];
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   const requiredRole = to.meta.requiredRole;

//   if (requiresAuth && !isAuthenticated) {
//     next({ name: 'log' }); // Перенаправление на страницу авторизации
//   } else if (requiresAuth && requiredRole && userRole !== requiredRole) {
//     next({ name: 'main' }); // Перенаправление на главную страницу, если роль не подходит
//   } else {
//     next(); // Продолжить навигацию
//   }
// });

export default router;
