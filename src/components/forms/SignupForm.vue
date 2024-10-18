<template>
    <AppForm
        ref="formRef"
        :elementsRefs="elementsRefs"
        :isError="props.isError"
        :errorMessage="props.errorMessage"
        :isLoading="props.isLoading"
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
        <template #submit-text>Sign Up</template>
    </AppForm>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { UserRegistration } from "@/types/requests"
import InputElement from "./elements/InputElement.vue"
import { isEmailValid, isPasswordValid } from "@/utils/validation"
import { getLocalLanguageCode } from "@/utils/functions"
import { InputElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
}>()

const emits = defineEmits<{
    onSubmit: [data: UserRegistration]
    onValidState: []
}>()

const elementIds = {
    name: "user-name",
    email: "user-email",
    password: "user-password",
    confirmPassword: "user-confirm-password"
}

const formElements: InputElementProps[] = [
    {
        id: elementIds.name,
        label: "Name",
        type: "text",
        placeholder: "Your name",
        tabIndex: 1,
        validationMessage: "is required",
        validateInput: value => typeof value === "string" && value.length > 2 && value.length < 150
    },
    {
        id: elementIds.email,
        label: "E-mail",
        type: "email",
        placeholder: "Your e-mail address",
        tabIndex: 2,
        validationMessage: "wrong e-mail format",
        validateInput: value => typeof value === "string" && isEmailValid(value)
    },
    {
        id: elementIds.password,
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        tabIndex: 3,
        validationMessage: "at least 8 letters (uppercase, lowercase, number)",
        validateInput: value => typeof value === "string" && isPasswordValid(value)
    },
    {
        id: elementIds.confirmPassword,
        label: "Password confirmation",
        type: "password",
        placeholder: "Confirm password",
        tabIndex: 4,
        validationMessage: "passwords do not match",
        validateInput: value => typeof value === "string" && elementsRefs.value[2]?.getValue() === value
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

    const registration: UserRegistration = {
        name: data.get(elementIds.name) as string,
        email: data.get(elementIds.email) as string,
        password: data.get(elementIds.password) as string,
        language: getLocalLanguageCode()
    }

    emits("onSubmit", registration)
}
</script>
