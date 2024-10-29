<template>
    <PageTitle title="Add Vocabulary" :description="getPageDescription" />
    <div class="flex-col-center" v-if="pickedLanguage && !isSentSuccessfully">
        <VocabularyItemForm
            :isError="isError"
            :isLoading="isAddFormLoading"
            :errorMessage="addFormErrorMessage"
            :is-for-edit="false"
            @on-submit="handleSubmitVocabulary"
            @on-valid-state="handleAddFormValidState"
        />
        <div ref="checkContainerRef" class="check-container">
            <FadeTransition>
                <PrimaryCard v-if="checkedWord" class="check-result-card">
                    <h2 class="text-center check-title">{{ checkedWord }}</h2>
                    <p class="text-center check-message" :class="wordExists ? 'exists' : 'not-exist'">
                        The word / phrase
                        {{ wordExists ? "already exists in your vocabulary" : "does not exist in your vocabulary" }}
                    </p>
                </PrimaryCard>
                <CheckWordForm
                    v-else
                    ref="checkFormRef"
                    :is-loading="isCheckFormLoading"
                    :is-error="isCheckError"
                    :error-message="checkFromErrorMessage"
                    @on-submit="handleSubmitCheck"
                    @on-valid-state="handleCheckFormValidState"
                />
            </FadeTransition>
        </div>
    </div>
    <div v-else-if="!pickedLanguage" class="vocabulary-setting flex-col-center">
        <AddVocabularySettingForm
            v-if="userLanguages.length > 0"
            :languages="userLanguages"
            :wordCounts="[1, 3, 5, 10, 15]"
            @on-submit="handleSubmitSettings"
        />
        <LoadingCard v-else />
        <div class="setting-nav-container flex-col-center">
            <p class="text-center">Or you can add new language to your vocabulary</p>
            <div class="setting-nav">
                <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.createLanguage }"
                    >New language</AppButton
                >
            </div>
        </div>
    </div>
    <PrimaryCard v-else class="flex-col-center">
        <p class="success-message">Vocabulary has been successfully added</p>
        <FaceSmileIcon class="success-state-icon" />
        <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.practice }"
            >Start Practice</AppButton
        >
        <AppButton :type="'button'" :button-style="'secondary'" @click-button="handleAddVocabulary"
            >Add Vocabulary</AppButton
        >
    </PrimaryCard>
</template>

<script setup lang="ts">
import VocabularyItemForm from "@/components/forms/VocabularyItemForm.vue"
import AddVocabularySettingForm from "@/components/forms/AddVocabularySettingForm.vue"
import CheckWordForm from "@/components/forms/CheckWordForm.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import useCallApi, { ErrorResponseType } from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { UserVocabularyLanguage } from "@/types/models"
import { CheckWordRequest, CreateVocabularyRequest, VocabularyItemRequest } from "@/types/requests"
import { UserVocabularyLanguagesResponse } from "@/types/responses"
import { parseToIntOrReturnNull } from "@/utils/functions"
import { FaceSmileIcon } from "@heroicons/vue/24/solid"
import { computed, onBeforeMount, ref } from "vue"
import { onBeforeRouteUpdate, RouteLocationNormalizedGeneric, useRoute, useRouter } from "vue-router"
import LoadingCard from "@/components/ui/card/LoadingCard.vue"
import FadeTransition from "@/components/transitions/FadeTransition.vue"

const { callApi } = useCallApi()
const route = useRoute()
const router = useRouter()

const userLanguages = ref<UserVocabularyLanguage[]>([])
const pickedLanguage = ref<UserVocabularyLanguage | null>(null)
const isAddFormLoading = ref(false)
const isCheckFormLoading = ref(false)
const isError = ref(false)
const isCheckError = ref(false)
const addFormErrorMessage = ref<string | null>(null)
const checkFromErrorMessage = ref<string | null>(null)
const checkedWord = ref<string | null>(null)
const wordExists = ref<boolean>(false)
const isSentSuccessfully = ref(false)

const checkContainerRef = ref<HTMLDivElement | null>(null)

const getPageDescription = computed(() => {
    if (pickedLanguage.value && !isSentSuccessfully.value) {
        return `Here you can add new words to your vocabulary of ${pickedLanguage.value.name} language`
    } else if (userLanguages.value.length === 0) {
        return "You can create a language for your new vocabulary"
    } else if (isSentSuccessfully.value) {
        return "You successfully added new words to your vocabulary"
    }

    return "Choose the language of your vocabulary you want to add new words to"
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

    setTimeout(() => {
        if (checkContainerRef.value) {
            checkContainerRef.value.style.height = `${checkContainerRef.value.offsetHeight}px`
        }
    }, 10)

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

function handleAddFormValidState() {
    addFormErrorMessage.value = null
    isError.value = false
}

async function handleSubmitVocabulary(data: VocabularyItemRequest[]) {
    if (isAddFormLoading.value) {
        return
    }

    isAddFormLoading.value = true

    const response = await callApi<CreateVocabularyRequest, { message: string }>({
        method: "POST",
        endpoint: "/vocabularies",
        body: { languageId: pickedLanguage.value!.id, vocabularyItems: data }
    })

    if (response.isError) {
        isError.value = true
        isAddFormLoading.value = false

        if (response.errorType === ErrorResponseType.CONFLICT) {
            const existingWord = response.error?.existingWord

            const errorMessageText = "One or more words already exist in your vocabulary."

            if (existingWord) {
                addFormErrorMessage.value = `${errorMessageText} Existing word: '${existingWord}''`

                return
            }

            addFormErrorMessage.value = errorMessageText
        }

        return
    }

    isAddFormLoading.value = false
    isSentSuccessfully.value = true
}

function handleAddVocabulary() {
    isSentSuccessfully.value = false
    router.push({ name: ROUTE_NAMES.addVocabulary })
}

function handleCheckFormValidState() {
    checkFromErrorMessage.value = null
    isCheckError.value = false
}

async function handleSubmitCheck(word: string) {
    if (isCheckFormLoading.value) {
        return
    }

    isCheckFormLoading.value = true

    const response = await callApi<CheckWordRequest, { exists: boolean }>({
        method: "POST",
        endpoint: "/vocabularies/check",
        body: { languageId: pickedLanguage.value!.id, word }
    })

    if (response.isError) {
        isCheckFormLoading.value = false
        isCheckError.value = true
        checkFromErrorMessage.value = "An error occurred while checking the word"

        return
    }

    if (response.data!.exists) {
        wordExists.value = true
    } else {
        wordExists.value = false
    }

    checkedWord.value = word
    setTimeout(() => {
        checkedWord.value = null
    }, 3500)

    isCheckFormLoading.value = false
    isCheckError.value = false
}
</script>

<style scoped>
.flex-col-center {
    row-gap: 2rem;
}

.check-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.check-result-card {
    margin-top: 0.75rem;
}

.check-title {
    padding-top: 1rem;
}

.check-message {
    padding-bottom: 1rem;
}

.exists {
    color: var(--success-color);
}

.not-exist {
    color: var(--secondary-font-color);
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
