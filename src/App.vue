<template>
    <TopBar />
    <main>
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router"
import TopBar from "@/components/single/top-bar/TopBar.vue"
import { ROUTE_NAMES } from "./router"
import useUserAuth from "./composables/useUserAuth"

const router = useRouter()
const { isRefreshTokenExpired, accessToken } = useUserAuth()

router.beforeEach((to, from, next) => {
    if (isRefreshTokenExpired() && to.name !== ROUTE_NAMES.home) {
        return next({ name: ROUTE_NAMES.home })
    }

    if (accessToken.value === null && to.meta.authRequired) {
        if (from.meta.authRestricted) {
            return next({ name: ROUTE_NAMES.home })
        }
        return next(new Error("User is not authenticated"))
    }

    if (accessToken.value !== null && to.meta.authRestricted) {
        if (from.meta.authRequired) {
            return next({ name: ROUTE_NAMES.home })
        }

        return next(from)
    }

    next()
})
</script>

<style lang="css" scoped>
main {
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--primary-bg-color);
}
</style>
