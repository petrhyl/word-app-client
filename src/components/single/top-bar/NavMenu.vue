<template>
    <div class="menu-container">
        <button class="toggle-menu-btn" @click="toggleOpen" aria-label="Open menu">
            <XMarkIcon v-if="isMenuOpen" class="button-icon" />
            <Bars3Icon v-else class="button-icon" />
        </button>
        <div class="menu-wrapper">
            <div
                class="nav-menu-overlay"
                :class="{ opening: isMenuOpening, closing: !isMenuOpening, open: isMenuOpen }"
                @click.self="toggleOpen"
            ></div>
            <menu
                class="nav-menu-content"
                :class="{ opening: isMenuOpening, closing: !isMenuOpening, open: isMenuOpen }"
            >
                <UserMenu v-if="user?.id" :close-menu="closeMenu" />
                <UnloggedUserNav v-else css-class="unlogged-user-nav" :has-home-button="true" :close-menu="closeMenu" />
            </menu>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserMenu from "@/components/menu/UserMenu.vue"
import UnloggedUserNav from "@/components/nav/UnloggedUserNav.vue"
import useUserAuth from "@/composables/useUserAuth"
import { XMarkIcon } from "@heroicons/vue/24/solid"
import { Bars3Icon } from "@heroicons/vue/24/solid"
import { ref } from "vue"

defineExpose({
    closeMenu
})

const { user } = useUserAuth()

const isMenuOpen = ref(false)
const isMenuOpening = ref(false)

function toggleOpen() {
    if (isMenuOpen.value) {
        closeMenu()
    } else {
        isMenuOpen.value = true
        isMenuOpening.value = true
        document.body.classList.add("no-scroll")
    }
}

function closeMenu() {
    isMenuOpening.value = false
    document.body.classList.remove("no-scroll")
    setTimeout(() => {
        isMenuOpen.value = false
    }, 180)
}
</script>

<style lang="css" scoped>
.menu-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
}

.toggle-menu-btn {
    display: none;
}

.menu-wrapper {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
}

.nav-menu-overlay {
    display: flex;
}

.nav-menu-content {
    display: flex;
    gap: 0.75rem;
    transition: all 0.17s ease-out;
}

:deep(.nav-home-button) {
    display: none;
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
        stroke: var(--primary-font-color);
        stroke-width: 1px;
        color: var(--title-font-color);
    }

    .menu-wrapper {
        --menu-width: 320px;
    }

    .nav-menu-overlay {
        position: fixed;
        right: 0rem;
        top: calc(var(--header-height) - 4px);
        width: 100%;
        height: calc(100vh - var(--header-height) + 4px);
        display: none;
        justify-content: end;
        background-color: var(--overlay-color);
        z-index: 100;
        animation-duration: 180ms;
    }

    .nav-menu-overlay.open {
        display: flex;
    }

    .nav-menu-overlay.opening {
        animation-name: openBackground;
        animation-timing-function: ease-in;
    }

    .nav-menu-overlay.closing {
        animation-name: closeBackground;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
    }

    .nav-menu-content {
        display: none;
        position: absolute;
        right: -1.25rem;
        top: calc(var(--header-height) - 8px);
        height: calc(100vh - var(--header-height) + 4px);
        width: var(--menu-width);
        max-width: 90vw;
        flex-direction: column;
        padding: 2rem;
        background-color: var(--secondary-bg-color);
        overflow: hidden;
        z-index: 101;
        animation-duration: 180ms;
    }

    .nav-menu-content.open {
        display: flex;
        overflow-y: auto;
    }

    .nav-menu-content.opening {
        animation-name: openMenu;
        animation-timing-function: ease-out;
    }

    .nav-menu-content.closing {
        animation-name: closeMenu;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
    }

    :deep(.nav-home-button) {
        display: block;
    }

    :deep(.unlogged-user-nav) {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    @keyframes openMenu {
        0% {
            right: calc(calc(var(--menu-width) * -1) - 1.25rem);
        }
        100% {
            right: -1.25rem;
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
            right: -1.25rem;
        }
        100% {
            right: calc(calc(var(--menu-width) * -1) - 1.25rem);
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
