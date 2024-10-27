<template>
    <PageTitle
        title="Languages of your vocabularies"
        description="Here you can view all the languages in which you can practice your vocabulary"
    />
    <LoadingCard v-if="isLoading" />
    <PrimaryCard v-else-if="languages.length === 0 && !isLoading">
        <p class="text-center">You have not created any languages to your vocabulary yet.</p>
    </PrimaryCard>
    <LanguageList v-else :languages="languages" />
</template>

<script setup lang="ts">
import LoadingCard from "@/components/ui/card/LoadingCard.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import LanguageList from "@/components/vocabulary/LanguageList.vue"
import useCallApi from "@/composables/useCallApi"
import { ERROR_ROUTE_ERRORS } from "@/router"
import { UserVocabularyLanguage } from "@/types/models"
import { UserVocabularyLanguagesResponse } from "@/types/responses"
import { onBeforeMount, ref } from "vue"

const { callApi } = useCallApi()

const isLoading = ref(true)
const languages = ref<UserVocabularyLanguage[]>([])

onBeforeMount(async () => {
    const response = await callApi<null, UserVocabularyLanguagesResponse>({
        method: "GET",
        endpoint: "/languages/user"
    })

    if (response.isError) {
        throw new Error(ERROR_ROUTE_ERRORS.dataFetchingError)
    }

    languages.value = response.data?.languages || []
    isLoading.value = false
})
</script>
