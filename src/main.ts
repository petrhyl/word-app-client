import './assets/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import router, { ROUTE_NAMES } from './router'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
    router.addRoute({ name: ROUTE_NAMES.error, path: '/error', component: () => import('@/pages/ErrorPage.vue') })

    router.replace({ name: ROUTE_NAMES.error })
}

app.use(createPinia())
app.use(router)

app.mount('#app')