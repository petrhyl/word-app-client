import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'


export const ROUTE_NAMES = {
  home: 'home',
  account: 'account',
  profile: 'profile',
  addVocabulary: 'addVocabulary',
  vocabularyStats: 'vocabularyStats',
  signup: 'signup',
  vefication: 'vefication',
  login: 'login',
  practise: 'practise',
  practiseRunning: 'practise-running',
  notFound: 'notFound',
  error: 'error'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.home,
      component: HomePage
    },
    {
      path: '/account',
      name: ROUTE_NAMES.account,
      component: () => import('@/pages/account/AccountPage.vue'),
      meta: { authRequired: true },
      children: [
        {
          path: 'profile',
          name: ROUTE_NAMES.profile,
          component: () => import('@/pages/account/ProfilePage.vue')
        },
        {
          path: 'vocabularies/add',
          name: ROUTE_NAMES.addVocabulary,
          component: () => import('@/pages/account/vocabulary/AddVocabularyPage.vue')
        },
        {
          path: 'vocabularies/stats',
          name: ROUTE_NAMES.vocabularyStats,
          component: () => import('@/pages/account/vocabulary/VocabularyStatsPage.vue')
        }
      ]
    },
    {
      path: '/signup',
      name: ROUTE_NAMES.signup,
      meta: { authRestricted: true },
      component: () => import('@/pages/signup/SignupPage.vue')
    }, {
      path: '/signup/verification/:token',
      name: ROUTE_NAMES.vefication,
      meta: { authRestricted: true },
      component: () => import('@/pages/signup/verification/VerificationPage.vue')
    },
    {
      path: '/login',
      name: ROUTE_NAMES.login,
      meta: { authRestricted: true },
      component: () => import('@/pages/login/LoginPage.vue')
    },
    {
      path: '/practise',
      name: ROUTE_NAMES.practise,
      meta: { authRequired: true },
      component: () => import('@/pages/practise/PractisePage.vue'),
    },
    {
      path: '/practise/running',
      name: ROUTE_NAMES.practiseRunning,
      meta: { authRequired: true },
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
