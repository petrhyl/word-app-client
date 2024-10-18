<template>
    <div class="spinner-container" role="status">
        <div class="loader"></div>

        <span class="sr-only">Loading...</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
    defineProps<{
        spinnerWidthHeight?: string
        stripColor?: string
        circleColor?: string
        circleWidth?: number
    }>(),
    {
        spinnerWidthHeight: "1.5rem",
        stripColor: "#8fa2d1",
        circleColor: "#d9feff",
        circleWidth: 4
    }
)

const getCircleWidth = computed(() => `${props.circleWidth}px`)
</script>

<style>
.spinner-container {
    display: flex;
}

.loader {
    border-style: solid;
    border-color: v-bind(circleColor);
    border-width: v-bind(getCircleWidth);
    border-top-style: solid;
    border-top-color: v-bind(stripColor);
    border-top-width: v-bind(getCircleWidth);
    border-radius: 50%;
    width: v-bind(spinnerWidthHeight);
    height: v-bind(spinnerWidthHeight);
    -webkit-animation: spin 1.5s linear infinite;
    animation: spin 1.5s linear infinite;
}

@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
