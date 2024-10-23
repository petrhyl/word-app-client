<template>
    <AppForm
        ref="formRef"
        :elements-refs="elementsRefs"
        :is-loading="false"
        :is-error="false"
        :error-message="null"
        @submit-form="handleSubmit"
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
import { ExerciseQueryParams } from "@/types/requests"
import { SelectionElementProps, SelectionOptionProps } from "./elements/FormElementProps"
import SelectionElement from "./elements/SelectionElement.vue"
import { computed, ref } from "vue"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    languages: SelectionOptionProps[]
    amounts: SelectionOptionProps[]
}>()

const emits = defineEmits<{
    onSubmit: [data: ExerciseQueryParams]    
}>()

const isSubmitted = ref(false)

    const elementIds = {
    lang: "exercise-lang",
    count: "exercise-count"
}

const formElements = computed<SelectionElementProps[]>(() => [
    {
        id: elementIds.lang,
        label: "Language",
        tabIndex: 1,
        validationMessage: "choose language",
        options: props.languages,
        validateInput: value => typeof value === "string" && props.languages.some(lang => lang.value === value)
    },
    {
        id: elementIds.count,
        label: "Number of Words",
        tabIndex: 2,
        validationMessage: "choose one option",
        options: props.amounts,
        validateInput: value => typeof value === "string" && props.amounts.some(amount => amount.value === value)
    }
])

const elementsRefs = ref<InstanceType<typeof SelectionElement>[]>([])
const formRef = ref<InstanceType<typeof AppForm> | null>(null)

function handleValidate() {
    formRef.value?.setIsValid()
}

function handleSubmit(data: SubmitData) {    
    if (props.isLoading) {
        return
    }
    
    isSubmitted.value = true

    const langId = parseInt(data.get(elementIds.lang) as string)
    const limit = parseInt(data.get(elementIds.count) as string)

    emits('onSubmit', { langId, limit })
}
</script>

<style lang="css" scoped>
form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
</style>
