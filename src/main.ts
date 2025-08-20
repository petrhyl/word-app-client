import './assets/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import router, { ERROR_ROUTE_ERRORS, ROUTE_NAMES } from './router'
import ApiAccessor from './data/ApiAccessor'
import TokenAccessor from './data/TokenAccessor'

const app = createApp(App)
ApiAccessor.initalize(TokenAccessor.instance, import.meta.env.VITE_API_URL, 'user/refresh')

app.config.errorHandler = (err, _instance, _info) => {
    console.error(err)
    router.addRoute({ name: ROUTE_NAMES.error, path: '/error', component: () => import('@/pages/ErrorPage.vue') })

    let errorQuery

    if (err instanceof Error) {
        if (err.message === ERROR_ROUTE_ERRORS.invalidIdParam || err.message === ERROR_ROUTE_ERRORS.dataFetchingError) {
            errorQuery = { error: err.message }
        }
    }

    router.replace({ name: ROUTE_NAMES.error, query: errorQuery })
}


app.use(createPinia())
app.use(router)

app.mount('#app')