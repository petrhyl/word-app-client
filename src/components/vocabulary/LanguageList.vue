<template>
    <div class="language-list">
        <VocabularyLanguage v-for="language in languages" :key="language.id" :language="language" />
    </div>
</template>

<script setup lang="ts">
import { UserVocabularyLanguage } from "@/types/models"
import VocabularyLanguage from "./VocabularyLanguage.vue"

defineProps<{
    languages: UserVocabularyLanguage[]
}>()
</script>

<style lang="css" scoped>
.language-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 4rem;
    row-gap: 2rem;
}

@media screen and (max-width: 980px) {
    .language-list {
        grid-template-columns: 1fr;
    }
}
</style>
