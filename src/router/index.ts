// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/records',
      name: 'records',
      component: () => import('../views/RecordsView.vue'),
    },
    {
      path: '/records/:id',
      name: 'record-detail',
      component: () => import('../views/RecordDetailView.vue'),
      props: true
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
    },
    {
      path: '/collections/:id',
      name: 'collection-detail',
      component: () => import('../views/CollectionDetailView.vue'),
      props: true
    },
  ],
})

export default router