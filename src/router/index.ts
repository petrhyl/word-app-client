import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import { parseToIntOrReturnNull } from '@/utils/functions'


export const ROUTE_NAMES = {
  home: 'home',
  account: 'account',
  profile: 'profile',
  addVocabulary: 'addVocabulary',
  vocabularyStats: 'vocabularyStats',
  createLanguage: 'createLanguage',
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
          path: 'vocabulary/add',
          name: ROUTE_NAMES.addVocabulary,
          component: () => import('@/pages/account/vocabulary/AddVocabularyPage.vue')
        },
        {
          path: 'vocabulary/stats',
          name: ROUTE_NAMES.vocabularyStats,
          component: () => import('@/pages/account/vocabulary/VocabularyStatsPage.vue')
        },
        {
          path: 'vocabulary/languages/create',
          name: ROUTE_NAMES.createLanguage,
          component: () => import('@/pages/account/vocabulary/languages/CreateLanguagePage.vue')
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
        if (!to.query.langId || !parseToIntOrReturnNull(to.query.langId as string) || !to.query.limit || Number(to.query.limit) < 5 || Number(to.query.limit) > 100) {
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
  router.addRoute({ name: ROUTE_NAMES.error, path: '/error', component: () => import('@/pages/ErrorPage.vue') })
  router.replace({ name: ROUTE_NAMES.error })
})

export default router
