import { parseToIntOrReturnNull } from "@/utils/functions";
import { defineStore } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const ACCESS_TOKEN_KEY = 'aut-w'
const ACCESS_TOKEN_EXPIERY_KEY = 'eaut-w'
const REFRESH_TOKEN_KEY = 'rut-w'
const REFRESH_TOKEN_EXPIERY_KEY = 'erut-w'

export const useAuthStore = defineStore('authStore', () => {
    const accessTokenRef = ref<string | null>(null)
    const accessTokenExpiry = ref<number | null>(null)
    const refreshTokenRef = ref<string | null>(null)
    const refreshTokenExpiry = ref<number | null>(null)

    const accessToken = computed(() => accessTokenRef.value)
    const refreshToken = computed(() => refreshTokenRef.value)

    function nullifyTokens() {
        accessTokenRef.value = null
        accessTokenExpiry.value = null
        refreshTokenRef.value = null
        refreshTokenExpiry.value = null

        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(ACCESS_TOKEN_EXPIERY_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_EXPIERY_KEY)
    }

    function setTokens(accToken: string, accTokenExpiry: number, refrToken: string, refrTokenExpiry: number) {
        accessTokenRef.value = accToken
        accessTokenExpiry.value = accTokenExpiry
        refreshTokenRef.value = refrToken
        refreshTokenExpiry.value = refrTokenExpiry

        localStorage.setItem(ACCESS_TOKEN_KEY, accToken)
        localStorage.setItem(ACCESS_TOKEN_EXPIERY_KEY, accTokenExpiry.toString())
        localStorage.setItem(REFRESH_TOKEN_KEY, refrToken)
        localStorage.setItem(REFRESH_TOKEN_EXPIERY_KEY, refrTokenExpiry.toString())
    }

    function isRefreshTokenExpired(): boolean {
        return refreshTokenExpiry.value !== null && refreshTokenExpiry.value < Date.now() - 3000
    }

    onBeforeMount(() => {
        accessTokenRef.value = localStorage.getItem(ACCESS_TOKEN_KEY)
        accessTokenExpiry.value = parseToIntOrReturnNull(localStorage.getItem(ACCESS_TOKEN_EXPIERY_KEY))
        refreshTokenRef.value = localStorage.getItem(REFRESH_TOKEN_KEY)
        refreshTokenExpiry.value = parseToIntOrReturnNull(localStorage.getItem(REFRESH_TOKEN_EXPIERY_KEY))
    })

    return {
        accessToken,
        refreshToken,
        setTokens,
        isRefreshTokenExpired,
        nullifyTokens
    }
})