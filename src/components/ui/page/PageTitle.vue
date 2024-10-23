<template>
    <div class="page-title-container flex-col-center">
        <h1>{{ title }}</h1>
        <p v-if="description !== null" class="description">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    description: string | null
}>()
</script>

<style lang="css" scoped>
.page-title-container {
    row-gap: 2rem;
}

h1 {
    text-align: center;
}

.description {
    text-align: center;
}

@media screen and (max-width: 980px) {
    .page-title-container {
        row-gap: 1.5rem;
    }
}
</style>
