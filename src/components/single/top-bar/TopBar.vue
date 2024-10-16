<template>
    <header>
        <div class="header-content">
            <div class="pc-nav-container">
                <nav v-if="user?.id" class="app-nav-pc">
                    <AppButton :type="'link'" :style="'primary'" :route="{ name: ROUTE_NAMES.practise }">
                        Start Practise
                    </AppButton>
                    <AppButton :type="'link'" :style="'secondary'" :route="{ name: ROUTE_NAMES.addVocabulary }">
                        Add Vocabulary
                    </AppButton>
                </nav>
            </div>
            <div class="app-title">
                <AppButton :type="'link'" :style="'link'" :route="{ name: ROUTE_NAMES.home }">
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
import { useUserStore } from "@/store/user/userStore"
import NavMenu from "./NavMenu.vue";

const { user } = useUserStore()
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
}

.header-content > div {
    width: calc(100% / 3);
}

.pc-nav-container {
    justify-content: start;
    display: flex;
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
