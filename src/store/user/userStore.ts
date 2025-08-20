import { defineStore } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { AppUser } from "@/types/models";
import { LoginResponse, UserRegistrationResponse, UserResponse } from "@/types/responses";
import { UserLogin, UserLogout, UserRegistration } from "@/types/requests";
import TokenAccessor from "@/data/TokenAccessor"
import ApiAccessor, { ApiAccessResponse } from "@/data/ApiAccessor"

export const useUserStore = defineStore('userStore', () => {
    const tokenAccessor = TokenAccessor.instance
    const userRef = ref<AppUser | null>(null)
    const callApi = ApiAccessor.callApi

    const user = computed(() => {
        return userRef.value
    })

    async function login(data: UserLogin): Promise<ApiAccessResponse<LoginResponse>> {
        const response = await callApi<UserLogin, LoginResponse>({ endpoint: 'user/login', method: 'POST', body: data })

        if (response.data?.auth) {
            userRef.value = response.data.auth.user

            tokenAccessor.setAuthTokens(response.data.auth.token)
        }

        return response
    }

    function logout() {
        if (tokenAccessor.refreshToken !== null) {
            callApi<UserLogout, null>({ endpoint: 'user/logout', method: 'POST', body: { userId: userRef.value?.id || 0, refreshToken: tokenAccessor.refreshToken } })
        }

        tokenAccessor.clearAuthTokens()
        userRef.value = null
    }

    async function register(data: UserRegistration): Promise<ApiAccessResponse<UserRegistrationResponse>> {
        const response = await callApi<UserRegistration, UserRegistrationResponse>({ endpoint: 'user/register', method: 'POST', body: data })

        return response
    }

    function nullifyUser() {
        userRef.value = null
    }

    function setUser(fetchedUser: AppUser) {
        userRef.value = fetchedUser
    }

    onBeforeMount(async () => {
        const response = await callApi<null, UserResponse>({ endpoint: 'user/auth', method: 'GET' })

        if (response.isError) {
            return
        }

        userRef.value = response.data?.user || null
    })

    return {
        user,
        login,
        logout,
        register,
        setUser,
        nullifyUser
    }
})