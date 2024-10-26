<template>
    <div class="stats-container">
        <LanguageStatistics v-for="stat in stats" :key="stat.language.code" :stats="stat" />
    </div>
</template>

<script setup lang="ts">
import { VocabularyStats } from "@/types/models"
import LanguageStatistics from "./LanguageStatistics.vue";

defineProps<{
    stats: VocabularyStats[]
}>()
</script>

<style lang="css" scoped>
.stats-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}
</style>