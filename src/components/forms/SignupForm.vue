<template>
    <FormCard>
        <form @submit.prevent="handleSubmit">
            <InputElement
                ref="elementsRefs"
                :id="elementIds.name"
                :label="'Name'"
                :type="'text'"
                :placeholder="'Enter your name'"
                :isFormSubmitted="isSubmitted"
                :tabIndex="1"
                :validationMessage="'is required'"
                :validateInput="value => typeof value === 'string' && value.length > 2 && value.length < 150"
                :onValidate="handleValidate"
            />
            <InputElement
                ref="elementsRefs"
                :id="elementIds.email"
                :label="'Email'"
                :type="'email'"
                :placeholder="'Enter your email'"
                :isFormSubmitted="isSubmitted"
                :tabIndex="2"
                :validationMessage="'wrong format'"
                :validateInput="value => typeof value === 'string' && isEmailValid(value)"
            />
            <InputElement
                ref="elementsRefs"
                :id="elementIds.password"
                :label="'Password'"
                :type="'password'"
                :placeholder="'Enter your password'"
                :isFormSubmitted="isSubmitted"
                :tabIndex="3"
                :validationMessage="'has to contain at least 8 characters (uppercase, lowercase, number)'"
                :validateInput="value => typeof value === 'string' && isPasswordValid(value)"
            />
            <InvalidFormMessage :isShown="isFormInvalid" message="Please fill in all fields correctly" />
            <AppButton :type="'submit'" :style="'primary'" :isLoading="props.isLoading">Sign Up</AppButton>
        </form>
    </FormCard>
</template>

<script setup lang="ts">
import { ref } from "vue"
import FormCard from "../ui/form/FormCard.vue"
import { UserRegistration } from "@/types/requests"
import InputElement from "./elements/InputElement.vue"
import AppButton from "../ui/button/AppButton.vue"
import { isEmailValid, isPasswordValid } from "@/utils/validation"
import InvalidFormMessage from "./status/InvalidFormMessage.vue"
import { getLocalLanguageCode } from "@/utils/functions"

const props = defineProps<{
    isLoading: boolean
}>()

const emits = defineEmits<{
    onSubmit: [data: UserRegistration]
}>()

const elementIds = {
    name: "user-name",
    email: "user-email",
    password: "user-password"
}

const elementsRefs = ref<InstanceType<typeof InputElement>[]>([])

const isSubmitted = ref(false)
const isFormInvalid = ref(false)

function isAnyElementInvalid() {
    for (const element of elementsRefs.value) {
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
