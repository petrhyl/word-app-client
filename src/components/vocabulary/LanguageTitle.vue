<template>
<div class="language-title-container">
            <span class="language-label">language:</span>
            <h2 class="language">{{ languageName}}</h2>
        </div>
</template>

<script setup lang="ts">
defineProps<{
    languageName: string
}>()
</script>

<style scoped>
.language-title-container {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
}

.language-label {
    font-size: 0.9rem;
    color: var(--secondary-font-color);
}
</style>