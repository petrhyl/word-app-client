<template>
    <h3 class="prompt">Fill in all fields to add new words into your vocabulary</h3>
    <AppForm
        ref="formRef"
        :elements-refs="elementsRefs"
        :is-loading="isLoading"
        :is-error="isError"
        :error-message="errorMessage"
        @submit-form="handleSubmit"
        @on-valid-state="handleValidState"
    >
        <div v-for="(element, index) in formElements" class="word-item-container">
            <div class="word-item-number">
                <span>{{ index + 1 }}</span>
            </div>
            <div class="word-item">
                <InputElement
                    ref="elementsRefs"
                    :key="element.word.id"
                    v-bind="element.word"
                    @on-validate="handleValidate"
                />
                <TextElement
                    ref="elementsRefs"
                    :key="element.translation.id"
                    v-bind="element.translation"
                    @on-validate="handleValidate"
                />
            </div>
        </div>
        <div class="add-button-container">
            <AppButton :type="'button'" :button-style="'secondary'" @click-button="addWord"><span class="add-button-text">Add next word </span><ChevronDownIcon class="button-icon" /></AppButton>
        </div>
        <template #submit-text>Submit</template>
    </AppForm>
</template>

<script setup lang="ts">
import { VocabularyItemRequest } from "@/types/requests"
import { ref } from "vue"
import InputElement from "./elements/InputElement.vue"
import { InputElementProps, TextElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"
import TextElement from "./elements/TextElement.vue"
import AppButton from "../ui/button/AppButton.vue"
import { ChevronDownIcon } from "@heroicons/vue/20/solid"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
}>()

const emits = defineEmits<{
    onSubmit: [data: VocabularyItemRequest[]]
    onValidState: []
}>()

const formElementGroup: { word: InputElementProps; translation: TextElementProps } = {
    word: {
        id: "word-",
        label: "Word",
        type: "text",
        placeholder: "Word to translate",
        tabIndex: 1,
        validationMessage: "is empty or too long",
        validateInput: value => typeof value === "string" && value !== "" && value.length <= 120
    },
    translation: {
        id: "translation-",
        label: "Translations",
        placeholder: "Each translation phrase/word on a new line. Max 5 translations",
        tabIndex: 2,
        validationMessage: "can not be empty",
        rows: 5,
        validateInput: value => {
            if (typeof value !== "string") {
                return false
            }

            if (value === "") {
                return false
            }

            return value.split("\n").length <= 5
        }
    }
}

const formElements = ref<{ word: InputElementProps; translation: TextElementProps }[]>([
    {
        word: { ...formElementGroup.word, id: `${formElementGroup.word.id}0` },
        translation: { ...formElementGroup.translation, id: `${formElementGroup.translation.id}0` }
    }
])

const elementsRefs = ref<InstanceType<typeof InputElement>[]>([])
const formRef = ref<InstanceType<typeof AppForm> | null>(null)
const isSubmitting = ref(false)

function addWord() {
    const elementsCount = formElements.value.length
    formElements.value.push({
        word: {
            ...formElementGroup.word,
            id: `${formElementGroup.word.id}${elementsCount}`,
            tabIndex: 1 + elementsCount * 2
        },
        translation: {
            ...formElementGroup.translation,
            id: `${formElementGroup.translation.id}${elementsCount}`,
            tabIndex: 2 + elementsCount * 2
        }
    })
}

function handleValidate() {
    formRef.value?.setIsValid()
}

function handleValidState() {
    emits("onValidState")
}

function handleSubmit(data: SubmitData) {
    if (props.isLoading || isSubmitting.value) {
        return
    }

    isSubmitting.value = true

    const items = []

    for (let i = 0; i < formElements.value.length; i++) {
        const word = data.get(`word-${i}`) as string
        const translations = (data.get(`translation-${i}`) as string)
            .split("\n")
            .map(t => t.trim())
            .filter(t => t !== "")

        items.push({ word, translations })
    }

    emits("onSubmit", items)

    isSubmitting.value = false
}
</script>

<style lang="css" scoped>
.prompt {
    text-align: center;
}
.word-item-container {
    width: 100%;
    display: grid;
    grid-template-columns: 2.5ch auto;
    align-items: start;
    column-gap: 1rem;
}

.word-item-number {
    display: flex;
    justify-content: end;
    line-height: 1.7rem;
    padding-top: 2.5rem;
}

.word-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.75rem;
}

.add-button-container{
    padding-top: 0.25rem;
}

.add-button-text{
    padding-right: 0.5rem;
}

.button-icon {
    width: 1.5rem;
    height: 1.5rem;
    stroke: var(--primary-font-color);
    stroke-width: 2px;
    transition: all 0.17s ease-in-out;
}
</style>
