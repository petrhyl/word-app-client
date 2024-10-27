<template>
    <div class="language-container">
        <div class="language-name-container">
            <p class="language-title">language:</p>
            <h3 class="language-name">{{ language.name }}</h3>
        </div>
        <div class="language-nav">
            <AppButton
                type="link"
                :button-style="'primary'"
                :route="{ name: ROUTE_NAMES.vocabularyDetails, params: { langId: language.id } }"
                >View Vocabulary</AppButton
            >
            <AppButton type="button" :button-style="'danger'" @click-button="() => emits('deleteLanguage', language.id)"
                >Delete</AppButton
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserVocabularyLanguage } from "@/types/models"
import AppButton from "../ui/button/AppButton.vue"
import { ROUTE_NAMES } from "@/router"

defineProps<{
    language: UserVocabularyLanguage
}>()

const emits = defineEmits<{
    deleteLanguage: [id: number]
}>()
</script>

<style scoped>
.language-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
}

.language-name-container {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
}

.language-title {
    font-size: 0.9rem;
    color: var(--secondary-font-color);
}

.language-nav {
    display: flex;
    gap: 1.25rem;
}
</style>
