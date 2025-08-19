import { ROUTE_NAMES } from "@/router"
import { useAuthStore } from "@/store/user/authStore"
import { App } from "vue"
import { Router } from "vue-router"

export function installAuthGuard(app: App, router: Router){
    app.runWithContext(() => {
        router.beforeEach((to, _from, next) => {
            const {accessToken} = useAuthStore()

            if (to.meta.authRequired && !accessToken) {
                return next({ name: ROUTE_NAMES.login });
            }

            if (to.meta.authRestricted && accessToken) {
                return next({ name: ROUTE_NAMES.home });
            }
            
            next();
        });
    });
}