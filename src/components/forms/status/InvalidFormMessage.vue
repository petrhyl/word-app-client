<template>
    <div class="invalid-message-container">
        <div v-if="isShown" class="invalid-form-message">
            {{ message }}
        </div>
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
    width: 100%;
    text-align: end;
    color: var(--warning-color);
}

.invalid-message-container {
    width: 100%;
}
</style>
