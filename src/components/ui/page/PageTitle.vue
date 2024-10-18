<template>
    <h1>{{ title }}</h1>
    <p v-if="description !== null" class="description">{{ description }}</p>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    description: string | null
}>()
</script>

<style lang="css" scoped>
h1 {
    text-align: center;
}

.description {
    text-align: center;
}
</style>
