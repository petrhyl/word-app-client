<template>
    <div class="language-container">
        <h3 class="language-name">{{ language.name }}</h3>
        <div class="edit-nav">
            <AppButton type="link" :button-style="'primary'" :route="{name : ROUTE_NAMES.vocabularyDetails, params: {langId: language.id}}">View Vocabulary</AppButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserVocabularyLanguage } from '@/types/models';
import AppButton from '../ui/button/AppButton.vue';
import { ROUTE_NAMES } from '@/router';

defineProps<{
    language: UserVocabularyLanguage
}>()

</script>

<style scoped>
.language-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2.25rem;
}

</style>