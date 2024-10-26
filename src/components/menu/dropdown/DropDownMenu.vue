<template>
    <div ref="menuRef" class="drop-down-menu">
        <div class="drop-down-menu-button" @click="handleToggleShow">
            <slot name="button"></slot>
        </div>
        <ExpandCollapseTransition>
            <menu v-if="showItems" class="drop-down-items-container">
                <ul class="drop-down-menu-items">
                    <slot name="items"></slot>
                </ul>
            </menu>
        </ExpandCollapseTransition>
    </div>
</template>

<script setup lang="ts">
import ExpandCollapseTransition from "@/components/transitions/ExpandCollapseTransition.vue"
import { onMounted, onUnmounted, provide, ref } from "vue"
import { dropDownMenuInjectionKey } from "./DropDownMenuProvider"

const menuRef = ref<HTMLDivElement | null>(null)

const showItems = ref(false)

function handleClickMenuItem() {
    showItems.value = false
}

provide(dropDownMenuInjectionKey, { closeMenu: handleClickMenuItem })

function handleToggleShow() {
    showItems.value = !showItems.value
}

function closeMenu(e: MouseEvent) {
    if (menuRef.value?.contains(e.target ? (e.target as Node) : null)) {
        return
    }

    showItems.value = false
}

onMounted(() => {
    window.addEventListener("click", closeMenu)
})

onUnmounted(() => {
    window.removeEventListener("click", closeMenu)
})
</script>

<style lang="css" scoped>
.drop-down-menu {
    position: relative;
}

.drop-down-items-container {
    position: absolute;
    top: 100%;
    right: 0;
    padding-top: 0.25rem;
    z-index: 101;
}

.drop-down-menu-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--secondary-bg-color);
    border: 2px solid var(--card-border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
}
</style>
