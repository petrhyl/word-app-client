<template>
    <header>
        <div class="header-content">
            <div class="pc-nav-container"></div>
            <div class="app-title">
                <AppButton :type="'link'" :buttonStyle="'link'" :route="{ name: ROUTE_NAMES.home }">
                    <h1 @click="closeMenu">Word App</h1>
                </AppButton>
            </div>
            <NavMenu ref="navMenu" />
        </div>
    </header>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from "@/router"
import AppButton from "@/components/ui/button/AppButton.vue"
import NavMenu from "./NavMenu.vue"
import { ref } from "vue";

const navMenu = ref<InstanceType<typeof NavMenu>>()

function closeMenu() {
    navMenu.value?.closeMenu()    
}
</script>

<style lang="css" scoped>
header {
    position: relative;
    height: var(--header-height);
    display: flex;
    justify-content: center;
    background-color: var(--secondary-bg-color);
    box-shadow: 0 0 6px 0 var(--secondary-bg-color);
}

.header-content {
    position: fixed;
    width: 95%;
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--secondary-bg-color);
    padding: 4px 1.25rem 0 1.25rem;
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

    .header-content {
        width: 100%;
    }

    .header-content > div {
        width: auto;
    }
}
</style>
