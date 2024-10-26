<template>
    <h3 class="text-center">You can check if a word&nbsp;/&nbsp;phrase exists</h3>
    <AppForm
        ref="formRef"
        :elements-refs="elementsRefs"
        :is-loading="isLoading"
        :is-error="isError"
        :error-message="errorMessage"
        @submit-form="handleSubmit"
        @on-valid-state="handleValidState"
    >
        <InputElement
            v-for="element in formElements"
            ref="elementsRefs"
            :key="element.id"
            v-bind="element"
            @on-validate="handleValidate"
        />
        <template #submit-text>Check</template>
    </AppForm>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import InputElement from "./elements/InputElement.vue"
import { InputElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
}>()

const emits = defineEmits<{
    onSubmit: [data: string]
    onValidState: []
}>()

const elementIds = {
    chekingWord: "checking-word",
}

const formElements = computed<InputElementProps[]>(() => [
    {
        id: elementIds.chekingWord,
        label: "Word",
        type: "text",
        placeholder: "Potentially existing word / phrase",
        tabIndex: 1,
        validationMessage: "is empty or too long",
        validateInput: value => typeof value === "string" && value.length > 0 && value.length < 120
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

   const word = data.get(elementIds.chekingWord) as string    

    emits("onSubmit", word)
}
</script>
