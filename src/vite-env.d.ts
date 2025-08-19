/// <reference types="vite/client" />

declare module 'vue-router' {
    interface RouteMeta {
        authRequired?: boolean
        authRestricted?: boolean
    }
}

export { }