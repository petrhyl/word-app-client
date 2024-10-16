<template>
    <RouterLink v-if="type === 'link' && route" :to="route" :class="getCssClasses">
        <slot></slot>
    </RouterLink>
    <button v-if="type !== 'link'" :type="type" :class="getCssClasses">
        <slot></slot>
        <LoadingSpinner class="spinner" v-if="isSubmitting" />
    </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RouteLocationRaw } from "vue-router"
import LoadingSpinner from "./LoadingSpinner.vue"

const props = defineProps<{
    style: "primary" | "secondary" | "danger" | "link"
    type: "button" | "submit" | "link"
    isSubmitting?: boolean
    route?: RouteLocationRaw
}>()

const getCssClasses = computed(() => {
    return {
        button: true,
        primary: props.style === "primary",
        secondary: props.style === "secondary",
        danger: props.style === "danger",
        link: props.style === "link",
        "is-submitting": props.isSubmitting
    }
})
</script>

<style lang="css" scoped>
.button {
    width: 100%;
    min-width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-font-color);
    font-family: var(--navigation-font);
    font-weight: 500;
    cursor: pointer;
    border-radius: 5px;
    padding: 0.65rem 1.5rem;
    transition: all 0.18s ease-in-out;
}

button {
    position: relative;
}

button::deep(.spinner) {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.primary {
    background-color: var(--primary-btn-color);
}

.secondary {
    background-color: var(--secondary-btn-color);
}

.danger {
    background-color: #c20044;
    color: #dac77b;
}

.link {
    background-color: transparent;
}

.link:hover {
    text-shadow: 0 0 2px var(--primary-text-color);
}

.button:hover {
    filter: brightness(1.2);
}

.is-submitting {
    pointer-events: none;
    filter: brightness(0.8);
}
</style>
