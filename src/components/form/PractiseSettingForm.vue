<template>
    <form class="form" @submit.prevent="handleSubmit">

    </form>
</template>

<script setup lang="ts">
import { VocabularyQueryParams } from '@/types/requests';

const emits = defineEmits<{
    onSubmit: [data: VocabularyQueryParams]
}>()

function handleSubmit() {
}

</script>

<style lang="css" scoped>
.form{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 92%;
    max-width: 470px;
    padding: 1rem;
}
</style>
