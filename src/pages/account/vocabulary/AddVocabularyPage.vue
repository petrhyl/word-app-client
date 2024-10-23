<template>
    <PageTitle title="Add Vocabulary" :description="getPageDescription" />
    <AddVocabularyForm
        v-if="pickedLanguage && !isSentSuccessfully"
        :isError="isError"
        :isLoading="isLoading"
        :errorMessage="null"
        @on-submit="handleSubmitVocabulary"
        @on-valid-state="handleValidState"
    />
    <div v-if="!pickedLanguage" class="vocabulary-setting flex-col-center">
        <AddVocabularySettingForm
            v-if="userLanguages.length > 0"
            :languages="userLanguages"
            :wordCounts="[1, 3, 5, 10, 15]"
            @on-submit="handleSubmitSettings"
        />
        <PrimaryCard v-else>
            <div class="loading-container flex-col-center">
                <LoadingSpinner spinner-width-height="3rem" />
            </div>
        </PrimaryCard>
        <div class="setting-nav-container flex-col-center">
            <p class="title">Or you can add new language to your vocabulary</p>
            <div class="setting-nav">
                <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.createLanguage }"
                    >New language</AppButton
                >
            </div>
        </div>
    </div>
    <PrimaryCard v-if="isSentSuccessfully" class="flex-col-center">
        <p class="title">Vocabulary has been successfully added</p>
        <FaceSmileIcon class="success-state-icon" />
        <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.practise }"
            >Start Practise</AppButton
        >
        <AppButton :type="'button'" :button-style="'secondary'" @click-button="handleAddVocabulary"
            >Add Vocabulary</AppButton
        >
    </PrimaryCard>
</template>

<script setup lang="ts">
import AddVocabularyForm from "@/components/forms/AddVocabularyForm.vue"
import AddVocabularySettingForm from "@/components/forms/AddVocabularySettingForm.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import LoadingSpinner from "@/components/ui/button/LoadingSpinner.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import useCallApi, { ErrorResponseType } from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { UserVocabularyLanguage } from "@/types/models"
import { CreateVocabularyRequest, VocabularyItemRequest } from "@/types/requests"
import { UserVocabularyLanguagesResponse } from "@/types/responses"
import { parseToIntOrReturnNull } from "@/utils/functions"
import { FaceSmileIcon } from "@heroicons/vue/24/solid"
import { computed, onBeforeMount, ref } from "vue"
import { onBeforeRouteUpdate, RouteLocationNormalizedGeneric, useRoute, useRouter } from "vue-router"

const { callApi } = useCallApi()
const route = useRoute()
const router = useRouter()

const userLanguages = ref<UserVocabularyLanguage[]>([])
const pickedLanguage = ref<UserVocabularyLanguage | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const isSentSuccessfully = ref(false)

const getPageDescription = computed(() => {
    if (pickedLanguage.value && !isSentSuccessfully.value) {
        return `Here you can add new words to your vocabulary of ${pickedLanguage.value.name} language`
    } else if (userLanguages.value.length === 0) {
        return "You can create a language for your new vocabulary"
    } else if (isSentSuccessfully.value) {
        return "You successfully added new words to your vocabulary"
    }

    return "Choose the language of the vocabulary you want to add words to"
})

function retreiveVocabularySettings(
    currentRoute: RouteLocationNormalizedGeneric,
    languages: UserVocabularyLanguage[]
): UserVocabularyLanguage | null {
    if (!currentRoute.query || !currentRoute.query.langId) {
        return null
    }

    const languageId = parseToIntOrReturnNull(currentRoute.query.langId as string)

    if (languageId === null) {
        return null
    }

    const language = languages.find(lang => lang.id === languageId)

    if (!language) {
        return null
    }

    return language
}

onBeforeMount(async () => {
    const result = await callApi<null, UserVocabularyLanguagesResponse>({ method: "GET", endpoint: "/languages/user" })

    if (!result.isError) {
        if (result.data!.languages.length === 0) {
            router.push({ name: ROUTE_NAMES.createLanguage })
        }

        userLanguages.value = result.data!.languages
        pickedLanguage.value = retreiveVocabularySettings(route, result.data!.languages)
    }
})

onBeforeRouteUpdate((to, _from) => {
    pickedLanguage.value = retreiveVocabularySettings(to, userLanguages.value)
})

function handleSubmitSettings(data: UserVocabularyLanguage) {
    router.push({
        name: ROUTE_NAMES.addVocabulary,
        query: { langId: data.id.toString() }
    })
}

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmitVocabulary(data: VocabularyItemRequest[]) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<CreateVocabularyRequest, { message: string }>({
        method: "POST",
        endpoint: "/vocabularies",
        body: { languageId: pickedLanguage.value!.id, vocabularyItems: data }
    })

    if (response.isError) {
        isError.value = true
        isLoading.value = false

        if (response.errorType === ErrorResponseType.CONFLICT) {
            errorMessage.value = "One or more words already exist in your vocabulary"
        }

        return
    }

    isSentSuccessfully.value = true
}

function handleAddVocabulary() {
    isSentSuccessfully.value = false
    router.push({ name: ROUTE_NAMES.addVocabulary })
}
</script>

<style scoped>
.title {
    text-align: center;
}

.loading-container {
    height: 5rem;
    min-width: 30vw;
    padding: 2.5rem;
}

.vocabulary-setting {
    width: 100%;
    row-gap: 2rem;
}

.setting-nav-container {
    row-gap: 1.5rem;
    padding-top: 1rem;
}

.setting-nav {
    display: flex;
    justify-content: center;
}

.success-state-icon {
    width: 3rem;
    height: 3rem;
    color: var(--success-color);
}
</style>
