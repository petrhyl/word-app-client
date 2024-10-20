<template>
    <DropDownMenu>
        <template #button>
            <AppButton :type="'button'" :style="'ternary'">
                {{ getUserName }}
            </AppButton>
        </template>
        <template #items>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'link'" :style="'primary'" :route="{ name: ROUTE_NAMES.profile }">Profile</AppButton>
            </DropDownMenuItem>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'button'" :style="'secondary'" @click-button="handleLogout">Log Out</AppButton>
            </DropDownMenuItem>
        </template>
    </DropDownMenu>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import DropDownMenu from "@/components/menu/dropdown/DropDownMenu.vue"
import { ROUTE_NAMES } from "@/router"
import useUserAuth from "@/composables/useAppUser"
import DropDownMenuItem from "./dropdown/DropDownMenuItem.vue"
import { computed } from "vue"
import { useRouter } from "vue-router"

const { user, logout } = useUserAuth()
const router = useRouter()

const getUserName = computed(() => {
    let username = user.value?.name

    if (username && username?.length > 10) {
        return username.slice(0, 10) + "..."
    }

    return username
})

function handleLogout() {
    logout()    
    router.push({ name: ROUTE_NAMES.home })
}
</script>

<style lang="css" scoped>
.user-menu-item {
    min-width: 250px;
}
</style>
