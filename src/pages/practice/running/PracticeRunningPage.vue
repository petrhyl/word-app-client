<template>
    <PageWrapper>
        <PageTitle title="Practise" :description="getDescription" />
        <FadeTransition>
            <PractiseRunningForm
                v-if="answerState === 'answering' && exerciseWords.length > 0"
                :is-loading="isLoading"
                :word="exerciseWords[currentIndex].word"
                @on-submit="handleSubmitAnswer"
            />
            <PrimaryCard v-else-if="answerState === 'correct'">
                <h2 class="correct-answer text-center">Correct</h2>
                <FaceSmileIcon class="state-icon correct-answer" />
                <p class="text-center">Go Next</p>
                <form class="go-next-form" @submit.prevent="goNext">
                    <AppButton :type="'submit'" :button-style="'primary'" :is-submitting="isLoading"
                        ><span class="next-button-text">Next</span><ChevronRightIcon class="button-icon"
                    /></AppButton>
                </form>
            </PrimaryCard>
            <PrimaryCard v-else-if="answerState === 'incorrect'">
                <h2 class="incorrect-answer text-center">Not Correct</h2>
                <FaceFrownIcon class="state-icon incorrect-answer" />
                <div class="correct-translations-container">
                    <p class="text-center translation-title">Correct translations:</p>
                    <p class="text-center translations">{{ exerciseWords[currentIndex].translations.join(", ") }}</p>
                </div>
                <p class="text-center">Try Next</p>
                <form class="go-next-form" @submit.prevent="goNext">
                    <AppButton :type="'submit'" :button-style="'primary'" :is-submitting="isLoading"
                        ><span class="next-button-text">Next</span><ChevronRightIcon class="button-icon"
                    /></AppButton>
                </form>
            </PrimaryCard>
            <PrimaryCard v-else-if="answerState === 'submitted' && !isError">
                <h2 class="text-center">Your results were submitted</h2>
                <p class="text-center final-message">
                    You translated correctly {{ getCorrectCount }} of {{ exerciseResults.length }} words
                </p>
                <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.practice }"
                    >Go to practice</AppButton
                >
                <AppButton :type="'link'" :button-style="'secondary'" :route="{ name: ROUTE_NAMES.languagesStats }"
                    >View stats</AppButton
                >
            </PrimaryCard>
            <PrimaryCard v-else-if="isError">
                <h2 class="text-center">Error</h2>
                <p class="text-center">{{ getErrorMesaage }}</p>
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
import useCallApi from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { ExerciseResultItem, ExerciseResultRequest } from "@/types/requests"
import { VocabularyItem, ExerciseResponse } from "@/types/responses"
import { ChevronRightIcon, FaceFrownIcon, FaceSmileIcon } from "@heroicons/vue/20/solid"
import { computed, onBeforeMount, ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { callApi } = useCallApi()

const exerciseWords = ref<VocabularyItem[]>([])
const currentIndex = ref(0)
const exerciseLanguageName = ref<string | null>(null)
const exerciseLanguageId = ref<number | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const answerState = ref<"correct" | "incorrect" | "answering" | "submitted">("answering")
const exerciseResults = ref<ExerciseResultItem[]>([])

const getDescription = computed(() => {
    if (exerciseLanguageName.value) {
        return `Type correct translation of ${exerciseLanguageName.value.toLowerCase()} word`
    }

    if (answerState.value === "submitted") {
        return "Results of your practice session were submitted"
    }

    return "Type correct translation of a word"
})
const getErrorMesaage = computed(() => {
    if (answerState.value === "submitted") {
        return "An error occurred while submitting your results"
    }

    return "An error occurred while loading your words"
})
const getCorrectCount = computed(() => {
    return exerciseResults.value.filter(item => item.isAnswredCorrectly).length
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
            form.querySelector("button")?.focus()
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
    if (currentIndex.value + 1 === exerciseWords.value.length) {
        submitResults()

        return
    }

    currentIndex.value++
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
        isError.value = true

        return
    }

    exerciseWords.value = response.data!.exercise.words
    exerciseLanguageName.value = response.data!.exercise.languageName
    exerciseLanguageId.value = response.data!.exercise.languageId
})
</script>

<style lang="css" scoped>
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
}

.final-message{
    padding: 0.75rem 0;
}

.text-center {
    min-width: 250px;
}
</style>
