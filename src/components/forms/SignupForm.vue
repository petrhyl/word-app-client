<template>
    <FormCard>
        <form @submit.prevent="handleSubmit">
            <InputElement
                v-for="element in formElements"
                ref="elementsRefs"
                :key="element.id"
                v-bind="element"
                @on-validate="handleValidate"
            />
            <InvalidFormMessage :isShown="isFormInvalid || isError" :message="getInvalidMessage" />
            <AppButton :type="'submit'" :style="'primary'" :is-submitting="isLoading">Sign Up</AppButton>
        </form>
    </FormCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import FormCard from "../ui/form/FormCard.vue"
import { UserRegistration } from "@/types/requests"
import InputElement from "./elements/InputElement.vue"
import AppButton from "../ui/button/AppButton.vue"
import { isEmailValid, isPasswordValid } from "@/utils/validation"
import InvalidFormMessage from "./status/InvalidFormMessage.vue"
import { getLocalLanguageCode } from "@/utils/functions"
import { InputElementProps } from "./elements/FormElementProps"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
}>()

const emits = defineEmits<{
    onSubmit: [data: UserRegistration]
}>()

const elementIds = {
    name: "user-name",
    email: "user-email",
    password: "user-password",
    confirmPassword: "user-confirm-password"
}

const formElements = computed<InputElementProps[]>(() => [
    {
        id: elementIds.name,
        label: "Name",
        type: "text",
        placeholder: "Your name",
        tabIndex: 1,
        validationMessage: "is required",
        isFormSubmitted: isSubmitted.value,
        validateInput: value => typeof value === "string" && value.length > 2 && value.length < 150
    },
    {
        id: elementIds.email,
        label: "Email",
        type: "email",
        placeholder: "Your email address",
        tabIndex: 2,
        validationMessage: "wrong format",
        isFormSubmitted: isSubmitted.value,
        validateInput: value => typeof value === "string" && isEmailValid(value)
    },
    {
        id: elementIds.password,
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        tabIndex: 3,
        validationMessage: "at least 8 letters (uppercase, lowercase, number)",
        isFormSubmitted: isSubmitted.value,
        validateInput: value => typeof value === "string" && isPasswordValid(value)
    },
    {
        id: elementIds.confirmPassword,
        label: "Password confirmation",
        type: "password",
        placeholder: "Confirm password",
        tabIndex: 4,
        validationMessage: "passwords do not match",
        isFormSubmitted: isSubmitted.value,
        validateInput: value => typeof value === "string" && elementsRefs.value[2]?.getValue() === value
    }
])

const elementsRefs = ref<InstanceType<typeof InputElement>[]>([])

const isSubmitted = ref(false)
const isFormInvalid = ref(false)

const getInvalidMessage = computed(() => {
    if (props.isError) {
        return "Something went wrong. Please try again later or contact us."
    } else {
        return "Please fill in all fields correctly"
    }
})

function isAnyElementInvalid() {
    for (const element of elementsRefs.value) {
        console.log(element)

        if (!element.isValid()) {
            return true
        }
    }

    return false
}

function handleValidate() {
    if (isAnyElementInvalid()) {
        return
    }

    isFormInvalid.value = false
}

function handleSubmit() {
    if (props.isLoading) {
        return
    }

    isSubmitted.value = true

    if (isAnyElementInvalid()) {
        isFormInvalid.value = true
        return
    }

    const data: UserRegistration = {
        name: elementsRefs.value[0].getValue() as string,
        email: elementsRefs.value[1].getValue() as string,
        password: elementsRefs.value[2].getValue() as string,
        language: getLocalLanguageCode()
    }

    emits("onSubmit", data)
}
</script>

<style lang="css" scoped>
form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
