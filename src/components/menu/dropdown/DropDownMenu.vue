<template>
    <div ref="menuRef" class="drop-down-menu">
        <div class="drop-down-menu-button" @click="toggleShowItems">
            <slot name="button"></slot>
        </div>
        <ExpandCollapseTransition>
            <div v-if="showItems" class="drop-down-items-container">
                <menu class="drop-down-menu-items">
                    <slot name="items"></slot>
                </menu>
            </div>
        </ExpandCollapseTransition>
    </div>
</template>

<script setup lang="ts">
import ExpandCollapseTransition from "@/components/transitions/ExpandCollapseTransition.vue"
import { onMounted, onUnmounted, ref } from "vue"

const menuRef = ref<HTMLDivElement | null>(null)

const showItems = ref(false)

function toggleShowItems(e: MouseEvent) {
    if (menuRef.value?.contains(e.target ? (e.target as Node) : null)) {
        showItems.value = !showItems.value
    } else {
        showItems.value = false
    }
}

onMounted(() => {
    window.addEventListener("click", toggleShowItems)
})

onUnmounted(() => {
    window.removeEventListener("click", toggleShowItems)
})
</script>

<style lang="css" scoped>
.drop-down-menu {
    position: relative;
}

.drop-down-items-container {
    position: absolute;
    top: 100%;
    padding-top: 0.75rem;
    z-index: 100;
}

.drop-down-menu-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--secondary-bg-color);
    border: 1px solid var(--form-border-color);
    border-radius: 5px;
    box-shadow: 0 0 5px #3e3e3e;
    padding: 0.5rem;
}
</style>
