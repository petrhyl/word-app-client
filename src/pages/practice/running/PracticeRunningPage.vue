<template>
    <PageWrapper>
        <PageTitle title="Practice" :description="getDescription" />
        <FadeTransition>
            <div
                v-if="answerState !== 'submitted' && isExerciseLoaded && exerciseWords.length > 0"
                class="practicing-from-container"
            >
                <ProgressBar :progress="getProgress" />
            </div>
        </FadeTransition>
        <FadeTransition>
            <PractiseRunningForm
                v-if="answerState === 'answering' && isExerciseLoaded && exerciseWords.length > 0"
                :is-loading="isLoading"
                :word="exerciseWords[currentIndex].word"
                @on-submit="handleSubmitAnswer"
            />
            <PrimaryCard v-else-if="answerState === 'answering' && isExerciseLoaded && exerciseWords.length === 0">
                <p class="text-center incorrect-answer">You have no words in your vocabulary to practice</p>
                <p class="text-center">Add some words to your vocabulary first</p>
                <AppButton
                    :type="'link'"
                    :button-style="'secondary'"
                    :route="{ name: ROUTE_NAMES.addVocabulary, query: { langId: route.query.langId?.toString() } }"
                    >Add Vocabulary</AppButton
                >
            </PrimaryCard>
            <PrimaryCard v-else-if="answerState === 'correct'">
                <h2 class="correct-answer text-center">Correct</h2>
                <FaceSmileIcon class="state-icon correct-answer" />
                <p class="text-center">{{ currentIndex === exerciseWords.length ? "Finish" : "Go Next" }}</p>
                <form class="go-next-form" @submit.prevent="goNext">
                    <AppButton :type="'submit'" :button-style="'primary'" :is-submitting="isLoading"
                        ><span class="next-button-text">{{
                            currentIndex === exerciseWords.length ? "Submit Results" : "Next"
                        }}</span
                        ><ChevronRightIcon v-if="currentIndex < exerciseWords.length" class="button-icon"
                    /></AppButton>
                    <AppButton
                        v-if="currentIndex === exerciseWords.length"
                        :type="'button'"
                        :button-style="'secondary'"
                        :is-submitting="isLoading"
                        @click-button="tryAgain"
                        >Try Again</AppButton
                    >
                </form>
            </PrimaryCard>
            <PrimaryCard v-else-if="answerState === 'incorrect'">
                <h2 class="incorrect-answer text-center">Not Correct</h2>
                <p class="translating-word">{{ exerciseWords[currentIndex - 1].word }}</p>
                <div class="correct-translations-container">
                    <p class="text-center translation-title">Correct translations:</p>
                    <p class="text-center translations">
                        {{ exerciseWords[currentIndex - 1].translations.join(", ") }}
                    </p>
                </div>
                <p class="text-center">{{ currentIndex === exerciseWords.length ? "Finish" : "Try Next" }}</p>
                <form class="go-next-form" @submit.prevent="goNext">
                    <AppButton :type="'submit'" :button-style="'primary'" :is-submitting="isLoading"
                        ><span class="next-button-text">{{
                            currentIndex === exerciseWords.length ? "Submit Results" : "Next"
                        }}</span
                        ><ChevronRightIcon v-if="currentIndex < exerciseWords.length" class="button-icon"
                    /></AppButton>
                    <AppButton
                        v-if="currentIndex === exerciseWords.length"
                        :type="'button'"
                        :button-style="'secondary'"
                        :is-submitting="isLoading"
                        @click-button="tryAgain"
                        >Try Again</AppButton
                    >
                </form>
            </PrimaryCard>
            <PrimaryCard v-else-if="answerState === 'submitted'">
                <p :class="isError ? 'text-center' : 'success-message'">{{ isError ? "Error" : "Your results" }}</p>
                <p class="text-center final-message">{{ getResultMessage }}</p>
                <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.practice }"
                    >Go to practice</AppButton
                >
                <AppButton :type="'link'" :button-style="'secondary'" :route="{ name: ROUTE_NAMES.languagesStats }"
                    >View stats</AppButton
                >
            </PrimaryCard>
            <LoadingCard v-else />
        </FadeTransition>
    </PageWrapper>
</template>

<script setup lang="ts">
import PractiseRunningForm from "@/components/forms/PracticeRunningForm.vue"
import FadeTransition from "@/components/transitions/FadeTransition.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import LoadingCard from "@/components/ui/card/LoadingCard.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import ProgressBar from "@/components/ui/ProgressBar.vue"
import useCallApi from "@/composables/useCallApi"
import { ERROR_ROUTE_ERRORS, ROUTE_NAMES } from "@/router"
import { ExerciseResultItem, ExerciseResultRequest } from "@/types/requests"
import { VocabularyItem, ExerciseResponse } from "@/types/responses"
import { ChevronRightIcon, FaceSmileIcon } from "@heroicons/vue/20/solid"
import { computed, onBeforeMount, ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { callApi } = useCallApi()

const exerciseWords = ref<VocabularyItem[]>([])
const isExerciseLoaded = ref(false)
const currentIndex = ref(0)
const exerciseLanguageName = ref<string | null>(null)
const exerciseLanguageId = ref<number | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const answerState = ref<"correct" | "incorrect" | "answering" | "submitted">("answering")
const exerciseResults = ref<ExerciseResultItem[]>([])

const getDescription = computed(() => {
    if (answerState.value === "submitted") {
        return "Results of your practice session were submitted"
    }

    if (currentIndex.value === exerciseWords.value.length && exerciseWords.value.length > 0) {
        return "You have completed your practice session"
    }

    if (exerciseLanguageName.value) {
        return `Type correct translation of ${exerciseLanguageName.value.toLowerCase()} word`
    }

    if (exerciseWords.value.length === 0 && isExerciseLoaded.value) {
        return "You have no words in your vocabulary to practice"
    }

    return "Type correct translation of a word"
})
const getCorrectCount = computed(() => {
    return exerciseResults.value.filter(item => item.isAnswredCorrectly).length
})
const getResultMessage = computed(() => {
    if (isError.value) {
        return "An error occurred while submitting your results"
    }

    return `You translated correctly ${getCorrectCount.value} of ${exerciseResults.value.length} words`
})
const getProgress = computed(() => {
    if (exerciseWords.value.length < 1) {
        return 0
    }

    const percentage = (currentIndex.value / exerciseWords.value.length) * 100
    return percentage > 100 ? 100 : percentage
})

function focusInput() {
    setTimeout(() => {
        const form = document.querySelector("form")

        if (form) {
            form.querySelector("input")?.focus()
        }
    }, 340)
}

function focusNextButton() {
    setTimeout(() => {
        const form = document.querySelector(".go-next-form")

        if (form) {
            form.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus()
        }
    }, 340)
}

async function submitResults() {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<ExerciseResultRequest, { message: string }>({
        method: "POST",
        endpoint: "/exercises/results",
        body: {
            languageId: exerciseLanguageId.value!,
            words: exerciseResults.value
        }
    })

    if (response.isError) {
        isError.value = true
    }

    isLoading.value = false
    answerState.value = "submitted"
}

function goNext() {
    if (currentIndex.value === exerciseWords.value.length) {
        submitResults()

        return
    }

    answerState.value = "answering"

    focusInput()
}

function tryAgain() {
    currentIndex.value = 0
    exerciseResults.value = []
    answerState.value = "answering"

    focusInput()
}

function handleSubmitAnswer(translation: string) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const currentItem = exerciseWords.value[currentIndex.value]
    const isCorrect = currentItem.translations.includes(translation)
    exerciseResults.value.push({
        id: currentItem.id,
        isAnswredCorrectly: isCorrect
    })

    answerState.value = isCorrect ? "correct" : "incorrect"
    currentIndex.value++

    isLoading.value = false
    focusNextButton()
}

onBeforeMount(async () => {
    const langId = parseInt(route.query.langId as string)
    const limit = parseInt(route.query.limit as string)

    const response = await callApi<null, ExerciseResponse>({
        method: "GET",
        endpoint: `/exercises?langId=${langId}&limit=${limit}`
    })

    if (response.isError) {
        throw new Error(ERROR_ROUTE_ERRORS.dataFetchingError)
    }

    isExerciseLoaded.value = true

    exerciseWords.value = response.data!.exercise.words
    exerciseLanguageName.value = response.data!.exercise.languageName
    exerciseLanguageId.value = response.data!.exercise.languageId

    focusInput()
})
</script>

<style lang="css" scoped>
.practicing-from-container {
    width: 100%;
    max-width: 480px;
    display: flex;
    justify-content: center;
}

.button-icon {
    width: 1.5rem;
    height: 1.5rem;
    stroke: var(--primary-font-color);
    stroke-width: 2px;
    color: var(--primary-font-color);
}

.state-icon {
    width: 3rem;
    height: 3rem;
    margin: 0.25rem auto;
}

.next-button-text {
    margin-right: 0.5rem;
}

.correct-answer {
    color: var(--success-color);
}

.incorrect-answer {
    color: var(--warning-color);
}

.translating-word {
    font-size: 1.5rem;
    text-align: center;
    font-weight: 600;
}

.translation-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.translations {
    font-size: 1.2rem;
    color: var(--secondary-font-color);
}

.go-next-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.final-message {
    padding: 0.75rem 0;
}

.text-center {
    min-width: 250px;
}
</style>
