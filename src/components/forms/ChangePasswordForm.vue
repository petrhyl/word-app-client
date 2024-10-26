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
        <template #submit-text>Change Password</template>
    </AppForm>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ChangePasswordRequest } from "@/types/requests"
import InputElement from "./elements/InputElement.vue"
import { isPasswordValid } from "@/utils/validation"
import { InputElementProps } from "./elements/FormElementProps"
import AppForm from "./form/AppForm.vue"
import { SubmitData } from "./form/SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
    isForgotten?: boolean
}>()

const emits = defineEmits<{
    onSubmitChange: [data: ChangePasswordRequest]
    onSubmitForgotten: [data: string]
    onValidState: []
}>()

const elementIds = {
    prevPassword: "prev-password",
    newPassword: "new-password",
    confirmPassword: "user-confirm-password"
}

const formElements = computed<InputElementProps[]>(() => {
    const newPasswordIndex = props.isForgotten ? 0 : 1 
    const inputs: InputElementProps[] = [
        {
            id: elementIds.newPassword,
            label: "New password",
            type: "password",
            placeholder: "New password",
            tabIndex: props.isForgotten ? 1 : 2,
            validationMessage: "at least 8 letters (uppercase, lowercase, number)",
            validateInput: value => typeof value === "string" && isPasswordValid(value)
        },
        {
            id: elementIds.confirmPassword,
            label: "Password confirmation",
            type: "password",
            placeholder: "Confirm password",
            tabIndex: props.isForgotten ? 2 : 3,
            validationMessage: "passwords do not match",
            validateInput: value => typeof value === "string" && elementsRefs.value[newPasswordIndex]?.getValue() === value
        }
    ]

    if (!props.isForgotten) {
        inputs.unshift({
            id: elementIds.prevPassword,
            label: "Old password",
            type: "watch-password",
            placeholder: "Old password",
            tabIndex: 1,
            validationMessage: "cannot be empty",
            validateInput: value => typeof value === "string" && value !== ""
        })
    }

    return inputs
})

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

    if (props.isForgotten) {
        const newPassword = data.get(elementIds.newPassword) as string
        emits("onSubmitForgotten", newPassword)

        return
    }

    const request: ChangePasswordRequest = {
        previousPassword: data.get(elementIds.prevPassword) as string,
        newPassword: data.get(elementIds.newPassword) as string
    }

    emits("onSubmitChange", request)
}
</script>
