import { defineStore } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { AppUser } from "@/types/models";
import useCallApi from "@/composables/useCallApi";
import { LoginResponse, UserRegistrationResponse, UserResponse } from "@/types/responses";
import { useAuthStore } from "./authStore";
import { UserLogin, UserRegistration } from "@/types/requests";

export const useUserStore = defineStore('userStore', () => {
    const authStore = useAuthStore()
    const userRef = ref<AppUser | null>(null)
    const { callApi } = useCallApi()

    const user = computed(() => {
        return userRef.value
    })

    async function login(data: UserLogin): Promise<AppUser | null> {
        const response = await callApi<UserLogin, LoginResponse>({ endpoint: '/user/login', method: 'POST', body: data })

        if (response.isError || !response.data?.auth) {
            return null
        }

        userRef.value = response.data.auth.user

        authStore.setTokens(
            response.data.auth.token.accessToken,
            response.data.auth.token.accessTokenExpiresIn,
            response.data.auth.token.refreshToken,
            response.data.auth.token.refreshTokenExpireIn
        )

        return response.data.auth.user
    }

    async function logout() {
        await callApi<null, null>({ endpoint: '/user/logout', method: 'POST' })
        authStore.nullifyTokens()
        userRef.value = null
    }

    async function register(data: UserRegistration): Promise<boolean> {
        const response = await callApi<UserRegistration, UserRegistrationResponse>({ endpoint: '/user/register', method: 'POST', body: data })

        if (response.isError || !response.data) {
            return false
        }

        if (response.data.auth) {
            userRef.value = response.data.auth.user
            authStore.setTokens(
                response.data.auth.token.accessToken,
                response.data.auth.token.accessTokenExpiresIn,
                response.data.auth.token.refreshToken,
                response.data.auth.token.refreshTokenExpireIn
            )
        }

        return true
    }

    onBeforeMount(async () => {
        const response = await callApi<null, UserResponse>({ endpoint: '/user/auth', method: 'GET' })

        if (response.isError) {
            return
        }

        userRef.value = response.data?.user || null
    })

    return {
        user,
        login,
        logout,
        register
    }
})