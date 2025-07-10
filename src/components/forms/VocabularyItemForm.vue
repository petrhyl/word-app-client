<template>
    <AppForm
        ref="formRef"
        :elements-refs="elementsRefs"
        :is-loading="isLoading"
        :is-error="isError"
        :error-message="errorMessage"
        @submit-form="handleSubmit"
        @on-valid-state="handleValidState"
    >
        <div ref="elementsContainerRef" :style="elementsContainerStyle" class="word-items-container">
            <div
                v-for="(element, index) in formElements"
                :class="isForEdit ? 'word-item-edit-container ' : 'word-item-add-container'"
            >
                <div v-if="!isForEdit" class="word-item-side">
                    <div class="word-item-number">
                        <span>{{ index + 1 }}</span>
                    </div>
                    <div class="word-item-remove">
                        <button
                            v-if="index === formElements.length - 1 && index > 0"
                            type="button"
                            class="remove-button"
                            @click="removeItem(index)"
                        >
                            <XMarkIcon class="remove-icon" />
                        </button>
                    </div>
                </div>
                <div class="word-item">
                    <InputElement
                        ref="elementsRefs"
                        :key="element.word.id"
                        v-bind="element.word"
                        :default-value="defaultValue?.word"
                        @on-validate="handleValidate"
                    />
                    <TextElement
                        ref="elementsRefs"
                        :key="element.translation.id"
                        v-bind="element.translation"
                        :default-value="defaultValue?.translations.join('\n')"
                        @on-validate="handleValidate"
                    />
                </div>
            </div>
        </div>
        <div v-if="!isForEdit" class="add-button-container">
            <AppButton :type="'button'" :button-style="'secondary'" @click-button="addWord"
                ><span class="add-button-text">Add next word </span><ChevronDownIcon class="button-icon"
            /></AppButton>
        </div>
        <div v-else class="note">If you edit this item its practice data will be erased</div>
        <template #submit-text>Submit</template>
    </AppForm>
</template>

<script setup lang="ts">
import { VocabularyItemRequest } from "@/types/requests"
import { CSSProperties, nextTick, ref } from "vue"
import InputElement from "./elements/InputElement.vue"
import { InputElementProps, TextElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"
import TextElement from "./elements/TextElement.vue"
import AppButton from "../ui/button/AppButton.vue"
import { ChevronDownIcon, XMarkIcon } from "@heroicons/vue/20/solid"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
    isForEdit: boolean
    defaultValue?: { word: string; translations: string[] }
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
        placeholder: "Word / phrase to translate",
        tabIndex: 1,
        validationMessage: "is empty or too long",
        validateInput: value => typeof value === "string" && value !== "" && value.length <= 120
    },
    translation: {
        id: "translation-",
        label: "Translations",
        placeholder: "Each translation word / phrase on a new line. Max 5 translations",
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
const elementsContainerRef = ref<HTMLElement | null>(null)
const elementsContainerStyle = ref<CSSProperties>({ height: "auto", overflow: "visible" })
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

    if (!elementsContainerRef.value) {
        return
    }

    const prevHeight = elementsContainerRef.value.scrollHeight

    nextTick(() => {
        if (!elementsContainerRef.value) {
            return
        }
        const newHeight = elementsContainerRef.value.scrollHeight

        elementsContainerStyle.value.height = `${prevHeight}px`
        elementsContainerStyle.value.overflow = "hidden"

        requestAnimationFrame(() => {
            elementsContainerStyle.value.height = `${newHeight}px`
        })

        const onTransitionEnd = () => {
            elementsContainerStyle.value.height = "auto"
            elementsContainerStyle.value.overflow = "visible"
            elementsContainerRef.value!.removeEventListener("transitionend", onTransitionEnd)
            window.scrollBy(0, newHeight - prevHeight)
        }

        elementsContainerRef.value.addEventListener("transitionend", onTransitionEnd)
    })
}

function removeItem(index: number) {
    formElements.value.splice(index, 1)

    if (!elementsContainerRef.value) {
        return
    }

    const prevHeight = elementsContainerRef.value.scrollHeight

    nextTick(() => {
        if (!elementsContainerRef.value) {
            return
        }

        elementsContainerStyle.value.height = `${prevHeight}px`
        elementsContainerStyle.value.overflow = "hidden"

        const newHeight = elementsContainerRef.value.scrollHeight

        requestAnimationFrame(() => {
            elementsContainerStyle.value.height = `${newHeight}px`
        })

        const onTransitionEnd = () => {
            elementsContainerStyle.value.height = "auto"
            elementsContainerStyle.value.overflow = "visible"
            elementsContainerRef.value!.removeEventListener("transitionend", onTransitionEnd)
        }

        elementsContainerRef.value.addEventListener("transitionend", onTransitionEnd)
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

.word-items-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    transition: height 250ms ease; /* Smooth height transition */
}

.word-item-add-container {
    width: 100%;
    display: grid;
    grid-template-columns: 2.5ch auto;
    align-items: start;
    column-gap: 0.75rem;
}

.word-item-edit-container {
    width: 100%;
    display: flex;
}

.word-item-side {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 2.5rem;
}

.word-item-number {
    display: flex;
    line-height: 1.7rem;
    justify-content: end;
}

.word-item-remove {
    padding-bottom: 0.25rem;
}

.remove-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-button:hover,
.remove-button:focus {
    filter: brightness(1.2);
}

.remove-icon {
    width: 1.75rem;
    height: 1.75rem;
    stroke: var(--secondary-font-color);
    stroke-width: 1.5;
}

.word-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.75rem;
}

.add-button-container {
    padding-top: 0.25rem;
}

.add-button-text {
    padding-right: 0.5rem;
}

.button-icon {
    width: 1.5rem;
    height: 1.5rem;
    stroke: var(--primary-font-color);
    stroke-width: 2px;
    transition: all 0.17s ease-in-out;
}

.note {
    color: var(--secondary-font-color);
    font-size: 0.9rem;
}
</style>
