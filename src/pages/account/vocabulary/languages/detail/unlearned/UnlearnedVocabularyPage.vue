<template>
  <PageTitle :title="getPageTitle" description="Here you can see unlearned vocabulary for the language" />
    <LanguageVocabularyComponent
        v-if="vocabularyItems.length > 0 && language"
        :vocabulary="vocabularyItems"
        :language="language"
    />
    <PrimaryCard v-else-if="language" class="flex-col-center">
        <p class="text-center">This language does not contain any unlearned vocabulary.</p>
        <p class="text-center">You can add some</p>
        <div class="add-nav-container">
            <AppButton :type="'link'" :button-style="'secondary'" :route="{ name: ROUTE_NAMES.addVocabulary, query: { langId: props.langId } }"
                >Add Vocabulary</AppButton
            >
        </div>
    </PrimaryCard>
    <LoadingCard v-else />
    <div class="next-vocabulary-button">
        <AppButton
            v-if="language && vocabularyItems.length === limit + offset"
            type="button"
            button-style="primary"
            :is-submitting="isLoading"
            @click-button="handleShowMore"
            >Show More</AppButton
        >
    </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/button/AppButton.vue';
import LoadingCard from '@/components/ui/card/LoadingCard.vue';
import PrimaryCard from '@/components/ui/card/PrimaryCard.vue';
import PageTitle from '@/components/ui/page/PageTitle.vue';
import LanguageVocabularyComponent from '@/components/vocabulary/details/LanguageVocabularyComponent.vue';
import ApiAccessor from '@/data/ApiAccessor'
import { ERROR_ROUTE_ERRORS, ROUTE_NAMES } from '@/router';
import { UserVocabularyLanguage } from '@/types/models';
import { LanguageVocabularyResponse, VocabularyItem } from '@/types/responses';
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps<{
    langId: string
}>()

const limit = 30

const callApi = ApiAccessor.callApi

const language = ref<UserVocabularyLanguage | null>(null)
const vocabularyItems = ref<VocabularyItem[]>([])
const isLoading = ref(false)
const offset = ref(0)

const getPageTitle = computed(() => {
    return language.value?.name ? `Unlearned vocabulary of ${language.value.name} language` : "Unlearned vocabulary"
})

async function handleShowMore() {
    if (isLoading.value) {
        return
    }

    if (vocabularyItems.value.length < limit + offset.value) {
        return
    }

    isLoading.value = true

    const newOffset = offset.value + limit
    offset.value += limit

    const response = await callApi<null, LanguageVocabularyResponse>({
        method: "GET",
        endpoint: `vocabularies/${props.langId}?limit=${limit}&offset=${newOffset}`
    })

    if (response.isError) {
        throw new Error(ERROR_ROUTE_ERRORS.dataFetchingError)
    }

    vocabularyItems.value.push(...(response.data?.vocabulary.items || []))

    isLoading.value = false
}

onBeforeMount(async () => {
    const response = await callApi<null, LanguageVocabularyResponse>({
        method: "GET",
        endpoint: `vocabularies/${props.langId}/unlearned?limit=${limit}&offset=${offset.value}`
    })

    if (response.isError) {
        throw new Error(ERROR_ROUTE_ERRORS.dataFetchingError)
    }

    language.value = response.data!.vocabulary.language
    vocabularyItems.value = response.data!.vocabulary.items
})
</script>

<style scoped>
.next-vocabulary-button {
    display: flex;
    justify-content: end;
}

.add-nav-container{
    display: flex;
    justify-content: center;
    padding-top: 1rem;
}
</style>