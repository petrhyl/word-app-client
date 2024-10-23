import { useAuthStore } from "@/store/user/authStore";
import { useUserStore } from "@/store/user/userStore";
import { storeToRefs } from "pinia";

export default function useUserAuth() {
    const authStore = useAuthStore()
    const { accessToken, refreshToken } = storeToRefs(authStore)
    const { setTokens, nullifyTokens, isRefreshTokenExpired } = authStore
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)
    const { login, logout, register, nullifyUser } = userStore

    function nullifyLogin() {
        nullifyTokens()        
        nullifyUser()
    }

    return {
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        register,
        setTokens,
        nullifyLogin,
        isRefreshTokenExpired
    }
}