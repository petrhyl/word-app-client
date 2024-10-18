<template>
    <RouterLink v-if="type === 'link' && route" :to="route" :class="getCssClasses">
        <slot></slot>
    </RouterLink>
    <button v-if="type !== 'link'" :type="type" :class="getCssClasses">
        <span class="button-content">
            <slot></slot>
        </span>
        <div class="spinner" v-if="isSubmitting">
            <LoadingSpinner :circle-color="'#fbfbfb'" :strip-color="'#14f9ff'" :circle-width="4"/>
        </div>
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
        clickable: true,
        button: props.style !== "link",
        primary: props.style === "primary",
        secondary: props.style === "secondary",
        danger: props.style === "danger",
        link: props.style === "link",
        "is-submitting": props.isSubmitting
    }
})
</script>

<style lang="css" scoped>
.clickable {
    cursor: pointer;
    transition: all 0.18s ease-in-out;
    color: var(--primary-font-color);
    font-family: var(--navigation-font);
    font-weight: 500;
    font-size: 1rem;
}

.button {
    width: 100%;
    min-width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
    padding: 0.65rem 1.5rem;
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
    text-shadow: 0 0 2px var(--primary-font-color);
}

.clickable:hover {
    filter: brightness(1.2);
}

.is-submitting {
    pointer-events: none;
    filter: brightness(0.8);
}

.spinner {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.is-submitting .button-content {
    opacity: 0;
}
</style>
