<template>
    <DropDownMenu>
        <template #button>
            {{ user?.name }}
        </template>
        <template #items>
            <AppButton :type="'link'" :style="'link'" :route="{ name: ROUTE_NAMES.profile }">Profile</AppButton>
            <AppButton :type="'button'" :style="'secondary'" @click="logout" >Log Out</AppButton>
        </template>
    </DropDownMenu>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import DropDownMenu from "./DropDownMenu.vue"
import { ROUTE_NAMES } from "@/router"
import { useUserStore } from "@/store/user/userStore"

const { user, logout } = useUserStore()

</script>
