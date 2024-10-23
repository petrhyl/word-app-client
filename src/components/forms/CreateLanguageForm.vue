<template>
    <h3 class="prompt">Choose one of allowed languages for the vocabulary you&nbsp;want&nbsp;to&nbsp;create</h3>
    <AppForm
        ref="formRef"
        :elements-refs="elementsRefs"
        :is-loading="isLoading"
        :is-error="isError"
        :error-message="errorMessage"
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
import { AppLanguage } from "@/types/models"
import AppForm from "./form/AppForm.vue"
import { computed, ref } from "vue"
import { SelectionElementProps } from "./elements/FormElementProps"
import SelectionElement from "./elements/SelectionElement.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
    allowedLanguages: AppLanguage[]
}>()

const emits = defineEmits<{
    onSubmit: [data: AppLanguage]
    onValidState: []
}>()

const elementIds = {
    lang: "vocabulary-lang"
}

const formElements = computed<SelectionElementProps[]>(() => [
    {
        id: elementIds.lang,
        label: "Language",
        tabIndex: 1,
        validationMessage: "",
        options: props.allowedLanguages.map(lang => ({ value: lang.code, label: lang.name })),
        defaultValue: "en",
        validateInput: value => typeof value === "string" && props.allowedLanguages.some(lang => lang.code === value)
    }
])

const elementsRefs = ref<InstanceType<typeof SelectionElement>[]>([])
const formRef = ref<InstanceType<typeof AppForm> | null>(null)

function handleValidate() {
    formRef.value?.setIsValid()
}

function handleValidState() {
    emits("onValidState")
}

function handleSubmit(data: SubmitData) {
    const lang: AppLanguage = props.allowedLanguages.find(l => l.code === (data.get(elementIds.lang) as string))!

    emits("onSubmit", lang)
}
</script>

<style scoped>
.prompt {
    text-align: center;
}
</style>
