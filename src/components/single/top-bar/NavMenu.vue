<template>
    <div class="menu-container">
        <button class="toggle-menu-btn" @click="toggleOpen" aria-label="Open menu">
            <XMarkIcon v-if="isMenuOpen" class="button-icon" />
            <Bars3Icon v-else class="button-icon" />
        </button>
        <div
            class="nav-menu"
            :class="{ opening: isMenuOpening, closing: !isMenuOpening, open: isMenuOpen }"
            @click.self="toggleOpen"
        >
            <menu class="nav-menu-content" :class="{ opening: isMenuOpening, closing: !isMenuOpening }">
                <div v-if="user?.id" class="user-nav-container">
                    <UserMenu />
                </div>
                <UnloggedUserNav v-else @click="toggleOpen" css-class="unlogged-user-nav" />
            </menu>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserMenu from "@/components/menu/dropdown/UserMenu.vue"
import UnloggedUserNav from "@/components/nav/UnloggedUserNav.vue"
import { useUserStore } from "@/store/user/userStore"
import { XMarkIcon } from "@heroicons/vue/24/solid"
import { Bars3Icon } from "@heroicons/vue/24/solid"
import { ref } from "vue"

const { user } = useUserStore()

const isMenuOpen = ref(false)
const isMenuOpening = ref(false)

function toggleOpen() {
    if (isMenuOpen.value) {
        isMenuOpening.value = false
        setTimeout(() => (isMenuOpen.value = false), 1800)
    } else {
        isMenuOpen.value = true
        isMenuOpening.value = true
    }
}
</script>

<style lang="css" scoped>
.menu-container {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
}

.toggle-menu-btn {
    display: none;
}

.nav-menu {
    display: flex;
}

.nav-menu-content {
    display: flex;
    gap: 0.75rem;
    transition: all 0.17s ease-out;
}

.user-nav-container {
    display: flex;
}

:deep(.unlogged-user-nav) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}

@media screen and (max-width: 980px) {
    .toggle-menu-btn {
        display: block;
    }

    .button-icon {
        width: 2.75rem;
        height: 2.75rem;
        stroke-width: 3px;
        color: var(--title-font-color);
    }

    .nav-menu {
        position: fixed;
        right: 0rem;
        top: calc(var(--header-height) - 4px);
        width: 100%;
        height: calc(100vh - var(--header-height) + 4px);
        display: none;
        justify-content: end;
        background-color: #1111114c;
        overflow: hidden;
        animation-duration: 180ms;
        --menu-translate-x: 321px;
    }

    .nav-menu.open {
        display: flex;
    }

    .nav-menu.opening {
        animation-name: openBackground;
        animation-timing-function: ease-in;
    }

    .nav-menu.closing {
        animation-name: closeBackground;
        animation-timing-function: ease-out;
    }

    .nav-menu-content.opening {
        display: flex;
        animation-name: openMenu;
        animation-timing-function: ease-out;
    }

    .nav-menu-content.closing {
        display: flex;
        animation-name: closeMenu;
        animation-timing-function: ease-in;
    }

    .nav-menu-content {
        display: none;
        width: 320px;
        max-width: 90%;
        flex-direction: column;
        padding: 1.5rem 2rem;
        background-color: var(--secondary-bg-color);
        animation-duration: 180ms;
    }

    .user-nav-container {
        display: none;
    }

    :deep(.unlogged-user-nav) {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-bottom: 1.5rem;
    }

    @keyframes openMenu {
        0% {
            transform: translateX(var(--menu-translate-x));
        }
        100% {
            transform: translateX(0);
        }
    }

    @keyframes openBackground {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes closeMenu {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(var(--menu-translate-x));
        }
    }

    @keyframes closeBackground {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
}
</style>
