<template>
    <header>
        <div class="header-content">
            <div class="pc-nav-container">
            </div>
            <div class="app-title">
                <AppButton :type="'link'" :buttonStyle="'link'" :route="{ name: ROUTE_NAMES.home }">
                    <h1>Word App</h1>
                </AppButton>
            </div>
            <NavMenu />
        </div>
    </header>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from "@/router"
import AppButton from "@/components/ui/button/AppButton.vue"
import NavMenu from "./NavMenu.vue"

</script>

<style lang="css" scoped>
header {
    position: relative;
    height: var(--header-height);
    background-color: var(--secondary-bg-color);
}

.header-content {
    position: fixed;
    width: 100%;
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--secondary-bg-color);
    padding: 4px 1.25rem 0 1.25rem;
    box-shadow: 0 0 5px var(--secondary-bg-color);
    z-index: 100;
}

.header-content > div {
    width: calc(100% / 3);
}

.app-title {
    justify-content: center;
    display: flex;
}

.app-title h1 {
    font-size: 2.5rem;
}

@media screen and (max-width: 980px) {
    .app-title h1 {
        font-size: 2rem;
    }

    .pc-nav-container {
        display: none;
    }

    .header-content > div {
        width: auto;
    }
}
</style>
