<template>
    <TopBar />
    <main>
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import { RouterView} from "vue-router"
import TopBar from "@/components/single/top-bar/TopBar.vue"
</script>

<style lang="css" scoped>
main {
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--primary-bg-color);
}
</style>
