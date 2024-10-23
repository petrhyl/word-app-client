<template>
    <PageWrapper>
        <PageTitle title="Account login" description="Log in to enjoy vocabulary practising." />
        <LoginForm
            :is-loading="isLoading"
            :is-error="isError"
            :error-message="errorMessage"
            @on-submit="handleSubmit"
            @on-valid-state="handleValidState"
        />
        <div class="flex-col-center">
            <p class="text-center">Or create your account</p>
            <AppButton :type="'link'" :button-style="'secondary'" :route="{ name: ROUTE_NAMES.signup}">
                Sign Up
            </AppButton>
        </div>
    </PageWrapper>
</template>

<script setup lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import { ref } from "vue"
import { UserLogin } from "@/types/requests"
import { useUserStore } from "@/store/user/userStore"
import { ErrorResponseType } from "@/composables/useCallApi"
import { onBeforeRouteUpdate, RouteLocationNormalizedLoadedGeneric, useRouter } from "vue-router"
import { ROUTE_NAMES } from "@/router"
import AppButton from "@/components/ui/button/AppButton.vue"

const { login } = useUserStore()
const router = useRouter()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const fromRoute = ref<RouteLocationNormalizedLoadedGeneric | null>(null)

function redirectLoggedIn() {
    if (fromRoute.value === null || fromRoute.value.meta?.authRestricted) {
        router.push({ name: ROUTE_NAMES.home })
        return
    }

    router.push(fromRoute.value.fullPath)
}

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmit(data: UserLogin) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await login(data)

    let errMessage: string | null = null
    if (response.errorType === ErrorResponseType.UNPROCESSABLE_ENTITY) {
        errMessage = "Invalid e-mail or password"
    }
    if (response.errorType === ErrorResponseType.FORBIDDEN) {
        errMessage = "Your e-mail address is not verified yet"
    }

    if (!response.isError && response.data !== null) {
        redirectLoggedIn()
        return
    }

    isError.value = response.isError
    errorMessage.value = errMessage
    isLoading.value = false
}

onBeforeRouteUpdate((_to, from) => {
    if (fromRoute.value !== null) {
        return
    }

    fromRoute.value = from
})
</script>

<style lang="css" scoped>
.flex-col-center {
    row-gap: 1rem;
}
</style>
