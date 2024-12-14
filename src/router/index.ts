import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import { parseToIntOrReturnNull } from '@/utils/functions'


export const ROUTE_NAMES = {
  home: 'home',
  signup: 'signup',
  vefication: 'vefication',
  login: 'login',
  changePassword: 'changePassword',
  resetPassword: 'resetPassword',
  forgetPassword: 'forgetPassword',
  profile: 'profile',
  updateUser: 'updateUser',
  vocabularyLanguages: 'vocabularyLanguages',
  addVocabulary: 'addVocabulary',
  languagesStats: 'vocabularyStats',
  unlearnedVocabulary: 'unlearnedVocabulary',
  vocabularyDetails: 'vocabularyDetails',
  editVocabularyItem: 'editVocabularyItem',
  createLanguage: 'createLanguage',
  practice: 'practice',
  practiceRunning: 'practice-running',
  notFound: 'notFound',
  error: 'error'
}

export const ERROR_ROUTE_ERRORS = {
  invalidIdParam: 'invalid-parameter',
  dataFetchingError: 'fetch-data'
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
      component: () => import('@/pages/account/AccountPage.vue'),
      meta: { authRequired: true },
      children: [
        {
          path: 'profile',
          name: ROUTE_NAMES.profile,
          component: () => import('@/pages/account/profile/ProfilePage.vue')
        },
        {
          path: 'profile/update',
          name: ROUTE_NAMES.updateUser,
          component: () => import('@/pages/account/profile/update/UpdateProfilePage.vue')
        },
        {
          path: 'change-password',
          name: ROUTE_NAMES.changePassword,
          component: () => import('@/pages/account/password/ChangePasswordPage.vue')
        },
        {
          path: 'vocabulary/add',
          name: ROUTE_NAMES.addVocabulary,
          component: () => import('@/pages/account/vocabulary/add/AddVocabularyPage.vue')
        },
        {
          path: 'vocabulary/languages',
          name: ROUTE_NAMES.vocabularyLanguages,
          component: () => import('@/pages/account/vocabulary/languages/VocabularyLanguagesPage.vue')
        },
        {
          path: 'vocabulary/languages/stats',
          name: ROUTE_NAMES.languagesStats,
          component: () => import('@/pages/account/vocabulary/languages/stats/LanguageStatsPage.vue')
        },
        {
          path: 'vocabulary/languages/create',
          name: ROUTE_NAMES.createLanguage,
          component: () => import('@/pages/account/vocabulary/languages/create/CreateLanguagePage.vue')
        },
        {
          path: 'vocabulary/languages/:langId/unlearned',
          name: ROUTE_NAMES.unlearnedVocabulary,
          props: true,
          component: () => import('@/pages/account/vocabulary/languages/detail/unlearned/UnlearnedVocabularyPage.vue'),
          beforeEnter: (to, _from, next) => {
            if (!to.params.langId || !parseToIntOrReturnNull(to.params.langId as string)) {
              return next(new Error(ERROR_ROUTE_ERRORS.invalidIdParam))
            }
            next()
          }
        },
        {
          path: 'vocabulary/languages/:langId',
          name: ROUTE_NAMES.vocabularyDetails,
          props: true,
          component: () => import('@/pages/account/vocabulary/languages/detail/VocabularyDetailsPage.vue'),
          beforeEnter: (to, _from, next) => {
            if (!to.params.langId || !parseToIntOrReturnNull(to.params.langId as string)) {
              return next(new Error(ERROR_ROUTE_ERRORS.invalidIdParam))
            }
            next()
          }
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
      props: true,
      meta: { authRestricted: true },
      component: () => import('@/pages/signup/verification/VerificationPage.vue'),
      beforeEnter: (to, _from, next) => {
        if (!to.params.token || to.params.token.length < 64) {
          return next(new Error(ERROR_ROUTE_ERRORS.invalidIdParam))
        }
        next()
      }
    },
    {
      path: '/login',
      name: ROUTE_NAMES.login,
      meta: { authRestricted: true },
      component: () => import('@/pages/login/LoginPage.vue')
    }, {
      path: '/forget-password',
      name: ROUTE_NAMES.forgetPassword,
      meta: { authRestricted: true },
      component: () => import('@/pages/forget-password/ForgetPasswordPage.vue')
    }, {
      path: '/reset-password/:token',
      name: ROUTE_NAMES.resetPassword,
      props: true,
      meta: { authRestricted: true },
      component: () => import('@/pages/reset-password/ResetPasswordPage.vue'),
      beforeEnter: (to, _from, next) => {
        if (!to.params.token || to.params.token.length < 64) {
          return next(new Error(ERROR_ROUTE_ERRORS.invalidIdParam))
        }
        next()
      }
    },
    {
      path: '/practice',
      name: ROUTE_NAMES.practice,
      meta: { authRequired: true },
      component: () => import('@/pages/practice/PracticePage.vue'),
    },
    {
      path: '/practice/running',
      name: ROUTE_NAMES.practiceRunning,
      meta: { authRequired: true },
      component: () => import('@/pages/practice/running/PracticeRunningPage.vue'),
      beforeEnter: (to, _from, next) => {
        if (!to.query.langId || !parseToIntOrReturnNull(to.query.langId as string) || !to.query.limit || Number(to.query.limit) < 5 || Number(to.query.limit) > 100) {
          return next({ name: ROUTE_NAMES.practice })
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

  let errorQuery

  if (err instanceof Error) {
    if (err.message === ERROR_ROUTE_ERRORS.invalidIdParam || err.message === ERROR_ROUTE_ERRORS.dataFetchingError) {
      errorQuery = { error: err.message }
    }
  }

  router.addRoute({ name: ROUTE_NAMES.error, path: '/error', component: () => import('@/pages/ErrorPage.vue') })
  router.replace({ name: ROUTE_NAMES.error, query: errorQuery })
})

export default router
