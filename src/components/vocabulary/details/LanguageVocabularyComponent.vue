<template>
    <div class="vocabulary-conatainer">
        <VocabularyWord v-for="word in vocabulary" :key="word.id" :item="word" :language-id="language.id" />
    </div>
</template>

<script setup lang="ts">
import { VocabularyItem } from "@/types/responses"
import VocabularyWord from "./VocabularyWord.vue"
import { UserVocabularyLanguage } from "@/types/models"

defineProps<{
    vocabulary: VocabularyItem[]
    language: UserVocabularyLanguage
}>()
</script>

<style scoped>
.vocabulary-conatainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2.75rem;
    row-gap: 1rem;
}

@media screen and (max-width: 980px) {
    .vocabulary-conatainer {
        display: grid;
        grid-template-columns: 1fr;
    }
}
</style>
