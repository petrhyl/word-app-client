<template>
    <div class="vocabulary-stats-conatiner">
        <LanguageTitle :language-name="stats.language.name" />
        <div class="statistics-container">
            <div class="stat-container">
                <span class="stat-label">Total answered words:</span>
                <span class="stat">{{ stats.totalAnsweredWords }}</span>
            </div>
            <div class="stat-container">
                <span class="stat-label">Success rate:</span>
                <span class="stat">{{ stats.successRate.toLocaleString("en", { maximumFractionDigits: 2 }) }} %</span>
            </div>
            <div class="stat-container">
                <span class="stat-label">Exercise average words amount:</span>
                <span class="stat">{{ Math.round(stats.answeredWordsAverage) }}</span>
            </div>
        </div>
        <div class="vocabulary-nav">
            <AppButton
                :type="'link'"
                :buttonStyle="'primary'"
                :route="{ name: ROUTE_NAMES.vocabularyDetails, params: { langId: stats.language.id } }"
                >View Vocabulary</AppButton
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
    justify-content: start;
    align-items: end;
}

.vocabulary-nav {
    display: flex;
    justify-content: end;
}
</style>
