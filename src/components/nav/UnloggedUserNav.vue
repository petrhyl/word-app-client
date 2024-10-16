<template>
    <nav :class="cssClass">
        <AppButton :type="'link'" :style="'primary'" :route="{ name: ROUTE_NAMES.login }"> Log In </AppButton>
        <AppButton :type="'link'" :style="'secondary'" :route="{ name: ROUTE_NAMES.signup }"> Sign Up </AppButton>
    </nav>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from "@/router"
import AppButton from "../ui/button/AppButton.vue"

defineProps<{
    cssClass: string
}>()
</script>
