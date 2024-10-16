<template>
    <div class="invalid-message-container">
        <span v-if="isShown" class="invalid-form-message"> {{ message }}<span>&nbsp;</span> </span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    message: string
    isShown: boolean
}>()
</script>

<style lang="css" scoped>
.invalid-form-message {
    padding-right: 0.5rem;
    color: var(--warning-color);
}

.invalid-message-container {
    width: 100%;
    display: flex;
    justify-content: end;
}
</style>
