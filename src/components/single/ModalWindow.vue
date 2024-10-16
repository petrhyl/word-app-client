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
                    <div class="modal-padding-element"></div>
                </div>
            </FadeTransition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid"
import FadeTransition from "../transitions/FadeTransition.vue"
import { ref, watch } from "vue";

const props = defineProps<{
    show: boolean
}>()

const emits = defineEmits(["clickCloseButton"])


const isShown = ref<boolean>(false)
const isWindowOpen = ref<boolean>(false)

watch(() => props.show, (value) => {
    if (value === true) {
        isShown.value = true
        setTimeout(() => {
            isWindowOpen.value = true
        }, 3)
    } else {
        isWindowOpen.value = false
        setTimeout(() => {
            isShown.value = false
        }, 175)
    }
})
</script>

<style scoped>
.modal-window-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ecedff80;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-window {
    background-color: var(--primary-bg-color);
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000001a;
}

.modal-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
    padding: 1rem 1.5rem;    
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
}

.modal-padding-element.top button {
    padding: 0.75rem;
}

.x-mark-icon {
    width: 1.5rem;
    height: 1.5rem;
    stroke-width: 0.5rem;
    color: var(--primary-font-color);
}
</style>
