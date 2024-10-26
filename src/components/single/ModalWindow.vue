<template>
    <Teleport v-if="isShown" to="#modal">
        <div class="modal-window-container">
            <FadeTransition>
                <div v-if="isWindowOpen" class="modal-window">
                    <div class="modal-padding-element top">
                        <button @click="emits('clickCloseButton')">
                            <XMarkIcon class="x-mark-icon" />
                        </button>
                    </div>
                    <div class="modal-content">
                        <slot></slot>
                    </div>
                    <div class="modal-padding-element bottom"></div>
                </div>
            </FadeTransition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid"
import FadeTransition from "../transitions/FadeTransition.vue"
import { onMounted, ref, watch } from "vue"

const props = defineProps<{
    show: boolean
}>()

const emits = defineEmits(["clickCloseButton"])

const isShown = ref<boolean>(props.show)
const isWindowOpen = ref<boolean>(false)
const timeout = ref<NodeJS.Timeout | null>(null)

function toggleOpen(isOpen: boolean) {
    if (timeout.value) {
        clearTimeout(timeout.value)
    }

    if (isOpen === true) {
        isShown.value = true
        timeout.value = setTimeout(() => {
            isWindowOpen.value = true
        }, 3)
    } else {
        isWindowOpen.value = false
        timeout.value = setTimeout(() => {
            isShown.value = false
        }, 175)
    }
}

watch(
    () => props.show,
    value => {
        toggleOpen(value)
    }
)

onMounted(() => {
    toggleOpen(props.show)
})
</script>

<style scoped>
.modal-window-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--overlay-color);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-window {
    max-width: 480px;
    background-color: var(--primary-bg-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1.5rem;
    padding: 1.5rem;
}

.modal-padding-element {
    width: 100%;
    height: 3rem;
    background-color: var(--secondary-bg-color);
}

.modal-padding-element.top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 1.5rem;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}

.modal-padding-element.top button {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0;
}

.modal-padding-element.bottom {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
}

.x-mark-icon {
    width: 2rem;
    height: 2rem;
    stroke: var(--primary-font-color);
    stroke-width: 2px;
    color: var(--primary-font-color);
}
</style>
