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
        <template #submit-text>Log In</template>
    </AppForm>
</template>

<script setup lang="ts">
import { UserLogin } from "@/types/requests"
import { computed, ref } from "vue"
import InputElement from "./elements/InputElement.vue"
import { InputElementProps } from "./elements/FormElementProps"
import { isEmailValid } from "@/utils/validation"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
}>()

const emits = defineEmits<{
    onSubmit: [data: UserLogin]
    onValidState: []
}>()

const elementIds = {
    email: "user-email",
    password: "user-password"
}

const formElements = computed<InputElementProps[]>(() => [
    {
        id: elementIds.email,
        label: "E-mail",
        type: "email",
        placeholder: "Your e-mail address",
        tabIndex: 1,
        validationMessage: "wrong e-mail format",
        validateInput: value => typeof value === "string" && isEmailValid(value)
    },
    {
        id: elementIds.password,
        label: "Password",
        type: "watch-password",
        placeholder: "Enter password",
        tabIndex: 2,
        validationMessage: "fill in the password",
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

    const login: UserLogin = {
        email: data.get(elementIds.email) as string,
        password: data.get(elementIds.password) as string
    }

    emits("onSubmit", login)
}
</script>
