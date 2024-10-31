<template>
    <RouterLink v-if="type === 'link' && route" :to="route" :class="getCssClasses">
        <slot></slot>
    </RouterLink>
    <button v-if="type !== 'link'" :type="type" :class="getCssClasses" @click="emits('clickButton')">
        <span class="button-content">
            <slot></slot>
        </span>
        <div class="spinner" v-if="isSubmitting">
            <LoadingSpinner :circle-color="'#fbfbfb'" :strip-color="'#14f9ff'" :circle-width="4" />
        </div>
    </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RouteLocationRaw } from "vue-router"
import LoadingSpinner from "./LoadingSpinner.vue"

const props = defineProps<{
    buttonStyle: "primary" | "secondary" | "ternary" | "quaternary" | "submit" | "danger" | "link"
    type: "button" | "submit" | "link"
    isSubmitting?: boolean
    isDisabled?: boolean
    route?: RouteLocationRaw
}>()

const emits = defineEmits(["clickButton"])

const getCssClasses = computed(() => {
    return {
        clickable: true,
        button: props.buttonStyle !== "link",
        primary: props.buttonStyle === "primary",
        secondary: props.buttonStyle === "secondary",
        ternary: props.buttonStyle === "ternary",
        quaternary: props.buttonStyle === "quaternary",
        submit: props.buttonStyle === "submit",
        danger: props.buttonStyle === "danger",
        link: props.buttonStyle === "link",
        disabled: props.isDisabled,
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
    border-width: 2px;
    border-style: solid;
    padding: 0.5rem 1.5rem;
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

button:focus {
    filter: brightness(1.2);
}

.primary {
    background-color: var(--primary-btn-color);
    border-color: var(--primary-btn-color);
}

.secondary {
    background-color: var(--secondary-btn-color);
    border-color: var(--secondary-btn-color);
}

.router-link-active.primary {
    box-shadow: 0 0 0 2px var(--secondary-bg-color), 0 0 0.25rem 0.25rem var(--primary-btn-color);
    filter: brightness(1.2);
}

.router-link-active.secondary {
    box-shadow: 0 0 0 2px var(--secondary-bg-color), 0 0 0.25rem 0.25rem var(--secondary-btn-color);
    filter: brightness(1.2);
}

.ternary {
    border-color: var(--primary-font-color);
}

.quaternary {
    background-color: #43434f;
    border-color: #43434f;
}

.submit {
    background-color: var(--submit-btn-color);
    border-color: var(--submit-btn-color);
}

.danger {
    background-color: var(--warning-color);
    border-color: var(--warning-color);
}

.clickable.disabled {
    filter: brightness(0.8) grayscale(0.6);
    pointer-events: none;
    color: var(--secondary-font-color);
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

.button-content {
    display: inline-flex;
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
