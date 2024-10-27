<template>
    <div class="progress-bar">
        <div class="progress-bar-container">
            <div class="progress-bar-progress" :style="{ width: `${progress}%` }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    progress: number;
}>()
</script>

<style scoped>
.progress-bar {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.progress-bar-container {
    width: 100%;
    height: 0.5rem;
    background-color: var(--secondary-font-color);
    border-radius: 0.5rem;
}

.progress-bar-progress {
    position: relative;
    height: 100%;
    background: linear-gradient(90deg, #29dbe8, #00eeff);
    border-radius: 0.5rem;
    transition: all 170ms ease-in-out;
}

.progress-bar-progress::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    background-color: transparent;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    box-shadow: 0.5rem 0 0.25rem 0 #00eeff;
}

.progress-bar-progress::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20%;
    height: 100%;
    background-color: transparent;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    box-shadow: 0.5rem 0 0.5rem 0 #00eeff;
}
</style>