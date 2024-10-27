<template>
    <div class="vocabulary-word-container">
        <div class="word title-value">
            <div class="title">word / phrase</div>
            <div class="value">{{ vacabularyItem.word }}</div>
        </div>
        <div class="last-answer title-value">
            <div class="title">last answer</div>
            <div class="value" :class="vacabularyItem.isLearned ? 'correct' : 'incorrect'">
                {{ vacabularyItem.isLearned ? "Correct" : "Incorrect" }}
            </div>
        </div>
        <div class="translations title-value">
            <div class="title">translations</div>
            <div class="value">{{ vacabularyItem.translations.join(", ") }}</div>
        </div>
        <div class="edit-container">
            <div class="edit-button-wrapper">
                <AppButton type="button" button-style="secondary" @click-button="handleEditItem">Edit</AppButton>
            </div>
        </div>
    </div>
    <ModalWindow :show="isEditing" @click-close-button="isEditing = false">
        <h2 class="text-center width-spacer">Edit vocabulary item</h2>
        <VocabularyItemForm
            :error-message="errorMessage"
            :is-error="isError"
            :is-loading="isLoading"
            :is-for-edit="true"
            :default-value="{ word: vacabularyItem.word, translations: vacabularyItem.translations }"
            @on-submit="handleSubmit"
            @on-valid-state="handleValidState"
        />
    </ModalWindow>
</template>

<script setup lang="ts">
import VocabularyItemForm from "@/components/forms/VocabularyItemForm.vue"
import ModalWindow from "@/components/single/ModalWindow.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import useCallApi, { ErrorResponseType } from "@/composables/useCallApi"
import { UpdateVocabularyItemRequest, VocabularyItemRequest } from "@/types/requests"
import { VocabularyItem } from "@/types/responses"
import { ref } from "vue"

const props = defineProps<{
    item: VocabularyItem
    languageId: number
}>()

const { callApi } = useCallApi()

const vacabularyItem = ref<VocabularyItem>(props.item)
const isEditing = ref(false)
const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)

function handleValidState() {
    isError.value = false
    errorMessage.value = null
}

async function handleSubmit(data: VocabularyItemRequest[]) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<UpdateVocabularyItemRequest, { message: string }>({
        method: "PUT",
        endpoint: `/vocabularies/items/${props.item.id}`,
        body: {
            languageId: props.languageId,
            word: data[0].word,
            translations: data[0].translations
        }
    })

    if (response.isError) {
        isError.value = true

        if (response.errorType === ErrorResponseType.CONFLICT) {
            errorMessage.value = "This word already exists in the vocabulary"
        }
    } else {
        isEditing.value = false
        vacabularyItem.value = {
            ...vacabularyItem.value,
            word: data[0].word,
            translations: data[0].translations,
            correctAnswers: 0,
            isLearned: false
        }
    }

    isLoading.value = false
}

function handleEditItem() {
    isEditing.value = true
}
</script>

<style scoped>
.vocabulary-word-container {
    display: grid;
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas:
        "word last-answer"
        "translations translations"
        "edit-container edit-container";
    row-gap: 0.75rem;
    column-gap: 1rem;
    border-bottom: var(--card-border);
    padding-bottom: 1rem;
}

.title-value {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
}

.title {
    color: var(--secondary-font-color);
    font-size: 0.9rem;
}

.value {
    display: flex;
    align-items: end;
}

.word {
    grid-area: word;
}

.last-answer {
    grid-area: last-answer;
}

.last-answer .value {
    justify-content: end;
}

.correct {
    color: var(--success-color);
}

.incorrect {
    color: var(--warning-color);
}

.translations {
    grid-area: translations;
}

.edit-container {
    grid-area: edit-container;
    display: flex;
    justify-content: end;
}

.edit-button-wrapper {
    display: flex;
    justify-content: end;
}

.width-spacer {
    width: 480px;
}

@media screen and (max-width: 680px) {
    .vocabulary-word-container {
        grid-template-areas:
            "word word last-answer"
            "translations translations"
            "edit-container edit-container";
    }

    .width-spacer {
        width: auto;
        min-width: 78vw;
    }
}
</style>
