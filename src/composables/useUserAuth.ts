import TokenAccessor from "@/data/TokenAccessor"
import { useUserStore } from "@/store/user/userStore"
import { AuthToken } from "@/types/models"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

export default function useUserAuth() {
    const tokenAccessor = ref(TokenAccessor.instance)
    const accessToken = computed(() => tokenAccessor.value.accessToken)
    const refreshToken = computed(() => tokenAccessor.value.refreshToken)

    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)
    const { login, logout, register, setUser } = userStore

    function nullifyLogin() {
        tokenAccessor.value.clearAuthTokens()
        userStore.nullifyUser()
    }

    function isRefreshTokenExpired(): boolean {
        return tokenAccessor.value.isRefreshTokenExpired()
    }

    function setTokens(tokens: AuthToken) {
        tokenAccessor.value.setAuthTokens(tokens)
    }

    return {
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        register,
        setTokens,
        setUser,
        nullifyLogin,
        isRefreshTokenExpired
    }
}