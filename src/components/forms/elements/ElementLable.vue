<template>
    <div class="label-container">
        <component :is="isLabel ? 'label' : 'div'" :for="forId" class="element-label">{{ label }}</component>
        <span v-if="isWarningDisplayed" class="warning">{{ validationMessage }}</span>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    forId: string
    label: string
    validationMessage: string
    isWarningDisplayed: boolean
    isLabel?: boolean
}>(),{
    isLabel: true
})
</script>

<style lang="css" scoped>
.label-container {
    display: flex;
    align-items: end;
    height: 1.5rem;
}

.element-label {
    flex-shrink: 0;
    font-family: var(--navigation-font);
    color: var(--title-font-color);
    font-size: 0.9rem;
    padding-right: 0.5rem;
    padding-left: calc(0.75rem + 2px);
}

.warning {
    color: var(--warning-color);
    font-size: 0.75rem;
    padding-bottom: 0.12rem;
}
</style>
