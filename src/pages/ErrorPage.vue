<template>
    <PageWrapper>
        <h1>Error</h1>
        <p class="sorry-text">We are sorry.<br />An error accured on the page. Please, try it later.</p>
        <span class="home-page-link">
            Go to <AppButton :type="'link'" :buttonStyle="'link'" :route="{ name: ROUTE_NAMES.home }">home page</AppButton>
        </span>
    </PageWrapper>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import { ROUTE_NAMES } from "@/router"
</script>

<style lang="css" scoped>
.sorry-text {
    font-size: 1.25rem;
    text-align: center;
}
</style>
