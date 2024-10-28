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
        <InputElement
            v-for="element in formElements"
            ref="elementsRefs"
            :key="element.id"
            v-bind="element"
            @on-validate="handleValidate"
        />
        <template #submit-text>Submit</template>
    </AppForm>
</template>

<script setup lang="ts">
import { UpdateUserRequest } from "@/types/requests"
import { ref } from "vue"
import InputElement from "./elements/InputElement.vue"
import { InputElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
    previousUsername: string
}>()

const emits = defineEmits<{
    onSubmit: [data: UpdateUserRequest]
    onValidState: []
}>()

const elementIds = {
    username: "user-name",
}

const formElements: InputElementProps[] = [
    {
        id: elementIds.username,
        label: "Your name",
        type: "text",
        placeholder: "New name",
        tabIndex: 1,
        defaultValue: props.previousUsername,
        validationMessage: "at least 3 characters",
        validateInput: value => typeof value === "string" && value.length > 2,
    }
]

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

    const request = {
        name: data.get(elementIds.username) as string,
        language: navigator.language.substring(0, 2),
    }

    emits("onSubmit", request)
}
</script>
