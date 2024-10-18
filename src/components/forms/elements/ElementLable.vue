<template>
    <div class="label-container">
        <label :for="forId">{{ label }}</label>
        <span v-if="isWarningDisplayed" class="warning">{{ validationMessage }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    forId: string
    label: string
    validationMessage: string
    isWarningDisplayed: boolean
}>()
</script>

<style lang="css" scoped>
.label-container {
    display: flex;
    align-items: center;
}

.label-container label {
    flex-shrink: 0;
    font-family: var(--navigation-font);
    color: var(--title-font-color);
    font-size: 1rem;
    line-height: 1.7rem;
    padding-right: 0.5rem;
    padding-left: calc(0.75rem + 2px);
}

.warning {
    color: var(--warning-color);
    font-size: 0.75rem;
}
</style>
