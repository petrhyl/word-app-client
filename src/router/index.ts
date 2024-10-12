import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'


export const ROUTE_NAMES = {
  home: 'home',
  account: 'account',
  practise: 'practise',
  practiseRunning: 'practise-running',
  notFound: 'notFound',
  error: 'error'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.home,
      component: HomePage
    },
    {
      path: '/account',
      name: ROUTE_NAMES.account,
      component: () => import('@/pages/account/AccountPage.vue')
    }, {
      path: '/practise',
      name: ROUTE_NAMES.practise,
      component: () => import('@/pages/practise/PractisePage.vue')
    },
    {
      path: '/practise/running',
      name: ROUTE_NAMES.practise,
      component: () => import('@/pages/practise/running/PractiseRunningPage.vue'),
      beforeEnter: (to, _from, next) => {
        if (!to.query.lang || !to.query.limit || Number(to.query.limit) < 5 || Number(to.query.limit) > 100) {
          return next({ name: ROUTE_NAMES.practise })
        }
        next()
      }
    },
    {
      path: '/:notFound(.*)',
      name: ROUTE_NAMES.notFound,
      component: NotFoundPage
    }
  ]
})

router.onError((err) => {
  console.error(err)
  router.replace({ name: ROUTE_NAMES.notFound })
})


export default router
