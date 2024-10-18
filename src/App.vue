<template>
    <TopBar />
    <main>
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router"
import TopBar from "@/components/single/top-bar/TopBar.vue"
import { useAuthStore } from "./store/user/authStore"
import { ROUTE_NAMES } from "./router"
import { HOME_PAGE_QUERIES, HOME_PAGE_QUERY_KEY_VALUE } from "./utils/constants"

const router = useRouter()
const { isRefreshTokenExpired, accessToken } = useAuthStore()

router.beforeEach((to, from, next) => {
    if (
        isRefreshTokenExpired() &&
        !(
            to.query &&
            to.query[HOME_PAGE_QUERY_KEY_VALUE.autoLoggedOut.key] === HOME_PAGE_QUERY_KEY_VALUE.autoLoggedOut.value
        )
    ) {
        return next({
            name: ROUTE_NAMES.home,
            query: HOME_PAGE_QUERIES.autoLoggedOut
        })
    }

    if (accessToken === null && to.meta.authRequired) {
        if (from.meta.authRestricted) {
            return next({ name: ROUTE_NAMES.home })
        }
        return next(new Error("User is not authenticated"))
    }

    if (accessToken !== null && to.meta.authRestricted) {
        if (from.meta.authRequired) {
            next({ name: ROUTE_NAMES.home })
            return
        }

        return next(false)
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
