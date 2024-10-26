<template>
    <nav :class="cssClass" id="user-nav-menu">
        <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.login }"> Log In </AppButton>
        <AppButton :type="'link'" :buttonStyle="'secondary'" :route="{ name: ROUTE_NAMES.signup }"> Sign Up </AppButton>
    </nav>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from "@/router"
import AppButton from "../ui/button/AppButton.vue"
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
    cssClass: string
    closeMenu: () => void
}>()

onMounted(()=>{
    for (const el of document.querySelector("#user-nav-menu")?.children || []) {
        if (el.tagName === "A" || el.tagName === "BUTTON") {
            el.addEventListener("click", props.closeMenu)
        }
    }
})

onUnmounted(() => {
    for (const el of document.querySelector("#user-nav-menu")?.children || []) {
        if (el.tagName === "A" || el.tagName === "BUTTON") {
            el.removeEventListener("click", props.closeMenu)
        }
    }
})
</script>
