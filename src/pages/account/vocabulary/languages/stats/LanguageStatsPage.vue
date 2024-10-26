<template>
    <PageTitle
        title="Your Statistics"
        description="Here you can see statistics of practicing vocabulary for every language"
    />
    <LoadingCard v-if="isLoading" />
    <LanguageStatisticsList v-else :stats="stats" />
</template>

<script setup lang="ts">
import LoadingCard from "@/components/ui/card/LoadingCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import LanguageStatisticsList from "@/components/vocabulary/stats/LanguageStatisticsList.vue"
import useCallApi from "@/composables/useCallApi"
import { VocabularyStats } from "@/types/models"
import { onBeforeMount, ref } from "vue"

const { callApi } = useCallApi()

const isLoading = ref(true)
const stats = ref<VocabularyStats[]>([])

onBeforeMount(async () => {
    const response = await callApi<null, { results: VocabularyStats[] }>({
        method: "GET",
        endpoint: "/exercises/results"
    })

    if (response.isError) {
        return
    }

    stats.value = response.data?.results || []
    isLoading.value = false
})
</script>
