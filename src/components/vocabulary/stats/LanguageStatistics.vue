<template>
    <div class="vocabulary-stats-conatiner">
        <LanguageTitle :language-name="stats.language.name" />
        <div class="statistics-container">
            <div class="stat-container">
                <div class="stat-label">Total answered words:</div>
                <div class="stat">{{ stats.totalAnsweredWords }}</div>
            </div>
            <div class="stat-container">
                <div class="stat-label">Success rate:</div>
                <div class="stat">{{ stats.successRate.toLocaleString("en", { maximumFractionDigits: 2 }) }} %</div>
            </div>
            <div class="stat-container">
                <div class="stat-label">Exercise average words amount:</div>
                <div class="stat">{{ Math.round(stats.answeredWordsAverage) }}</div>
            </div>
        </div>
        <div class="vocabulary-nav">
            <AppButton
                :type="'link'"
                :buttonStyle="'primary'"
                :route="{ name: ROUTE_NAMES.vocabularyDetails, params: { langId: stats.language.id } }"
                >View Vocabulary</AppButton
            >
            <AppButton
                :type="'link'"
                :buttonStyle="'secondary'"
                :route="{ name: ROUTE_NAMES.unlearnedVocabulary, params: { langId: stats.language.id } }"
                >Unlearned Vocabulary</AppButton
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import { ROUTE_NAMES } from "@/router"
import { VocabularyStats } from "@/types/models"
import LanguageTitle from "../LanguageTitle.vue"

defineProps<{
    stats: VocabularyStats
}>()
</script>

<style scoped>
.vocabulary-stats-conatiner {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.statistics-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-container {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 1.25rem;
}

.stat-label {
    line-height: 1.2rem;
}

.stat {
    color: var(--success-color);
    display: flex;
    justify-content: end;
    align-items: end;
}

.vocabulary-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}

@media screen and (max-width: 980px) {
    .vocabulary-nav {
        grid-template-columns: 1fr;
    }
}
</style>
