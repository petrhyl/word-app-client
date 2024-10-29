<template>
    <FadeTransition>
        <AppForm
            ref="formRef"
            :elements-refs="elementsRefs"
            :is-loading="isLoading"
            :is-error="false"
            :error-message="null"
            @submit-form="handleSubmit"
            @on-valid-state="handleValidState"
        >
            <div class="translating-word-container">
                <div class="title">Word to Translate</div>
                <div class="translating-word">{{ word }}</div>
            </div>
            <InputElement
                v-for="element in formElements"
                ref="elementsRefs"
                :key="element.id"
                v-bind="element"
                @on-validate="handleValidate"
            />
            <template #submit-text>Answer</template>
        </AppForm>
    </FadeTransition>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import InputElement from "./elements/InputElement.vue"
import { InputElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"
import FadeTransition from "../transitions/FadeTransition.vue"

const props = defineProps<{
    isLoading: boolean
    word: string
}>()

const emits = defineEmits<{
    onSubmit: [data: string]
    onValidState: []
}>()

const elementIds = {
    translation: "word-translation"
}

const formElements = computed<InputElementProps[]>(() => [
    {
        id: elementIds.translation,
        label: "Translation",
        type: "text",
        placeholder: "Type one of the word's translations",
        tabIndex: 1,
        validationMessage: "cannot be empty",
        notAutoComplete: true,
        validateInput: value => typeof value === "string"
    }
])

const elementsRefs = ref<InstanceType<typeof InputElement>[]>([])
const formRef = ref<InstanceType<typeof AppForm> | null>(null)

function handleValidate() {
    formRef.value?.setIsValid()
}

function handleValidState() {
    emits("onValidState")
}

function handleSubmit(data: SubmitData) {
    if (props.isLoading) {
        return
    }

    const translation = data.get(elementIds.translation) as string

    emits("onSubmit", translation)
}
</script>

<style lang="css" scoped>
.translating-word-container {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    padding-bottom: 1rem;
}

.translating-word-container .title {
    font-family: var(--navigation-font);
    line-height: 1.7rem;
    color: var(--title-font-color);
    padding-left: calc(0.75rem + 2px);
}

.translating-word {
    font-size: 1.75rem;
    text-align: center;
    font-weight: 600;
}
</style>
