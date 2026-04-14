import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'splash',
      component: () => import('../pages/SplashPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('../pages/SetupPage.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../pages/InventoryPage.vue'),
    },
    {
      path: '/ledger',
      name: 'ledger',
      component: () => import('../pages/LedgerPage.vue'),
    },
    {
      path: '/ledger/receivables',
      name: 'receivables',
      component: () => import('../pages/ReceivablesPage.vue'),
    },
    {
      path: '/ledger/payables',
      name: 'payables',
      component: () => import('../pages/PayablesPage.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../pages/SettingsPage.vue'),
    },
    {
      path: '/settings/security',
      name: 'security',
      component: () => import('../pages/SecurityPage.vue'),
    },
    {
      path: '/settings/backups',
      name: 'backups',
      component: () => import('../pages/BackupsPage.vue'),
    },
  ],
});
