<template>    
    <AppForm
        ref="formRef"
        :elements-refs="elementsRefs"
        :is-loading="false"
        :is-error="false"
        :error-message="null"
        @submit-form="handleSubmit"
        @on-valid-state="handleValidState"
    >
        <SelectionElement
            v-for="element in formElements"
            ref="elementsRefs"
            :key="element.id"
            v-bind="element"
            @on-validate="handleValidate"
        />
        <template #submit-text>Next</template>
    </AppForm>
</template>

<script setup lang="ts">
import { UserVocabularyLanguage } from "@/types/models"
import AppForm from "./form/AppForm.vue"
import { computed, ref } from "vue"
import { SelectionElementProps } from "./elements/FormElementProps"
import SelectionElement from "./elements/SelectionElement.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    languages: UserVocabularyLanguage[]
}>()

const emits = defineEmits<{
    onSubmit: [data: UserVocabularyLanguage]
}>()

const elementIds = {
    lang: "vocabulary-lang",
    count: "vocabulary-count"
}

const formElements = computed<SelectionElementProps[]>(() => [
    {
        id: elementIds.lang,
        label: "Language",
        tabIndex: 1,
        validationMessage: "",
        options: props.languages.map(lang => ({ value: lang.id.toString(), label: lang.name })),
        validateInput: value => typeof value === "string" && props.languages.some(lang => lang.id.toString() === value)
    }
])

const elementsRefs = ref<InstanceType<typeof SelectionElement>[]>([])
const formRef = ref<InstanceType<typeof AppForm> | null>(null)

function handleValidate() {
    formRef.value?.setIsValid()
}

function handleValidState() {}

function handleSubmit(data: SubmitData) {
    const language = props.languages.find(l => l.id === parseInt(data.get(elementIds.lang) as string))!

    emits("onSubmit", language)
}
</script>
