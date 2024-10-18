<template>
    <FormCard>
        <form @submit.prevent="handleSubmit">
            <slot> </slot>
            <InvalidFormMessage :isShown="!isFormValid || isError" :message="getInvalidMessage" />
            <AppButton :type="'submit'" :style="'primary'" :is-submitting="isLoading">
                <slot name="submit-text"></slot>
            </AppButton>
        </form>
    </FormCard>
</template>

<script setup lang="ts">
import FormCard from "@/components/ui/card/FormCard.vue"
import { computed, ref } from "vue"
import InputElement from "../elements/InputElement.vue"
import SelectionElement from "../elements/SelectionElement.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import InvalidFormMessage from "../status/InvalidFormMessage.vue"
import { SubmitData } from "./SubmitData"

const props = defineProps<{
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
    elementsRefs: InstanceType<typeof InputElement | typeof SelectionElement>[]
}>()

const emits = defineEmits<{
    submitForm: [data: SubmitData]
    onValidState: []
}>()

defineExpose({
    setIsValid,
    reset
})

const isFormValid = ref(true)

const getInvalidMessage = computed(() => {
    if (!isFormValid.value) {
        return "Please fill in all fields correctly"
    }

    if (props.errorMessage) {
        return props.errorMessage
    }

    return "Something went wrong. Please try it again later or contact us."
})

function retreiveData(): SubmitData | null {
    const data = new Map<string, string | File | null>()
    let isAnyInvalid = false
    for (const element of props.elementsRefs) {
        if (!element.isValid()) {
            isAnyInvalid = true
        }

        element.setIsFormSubmitted()
        data.set(element.getId(), element.getValue())
    }

    if (isAnyInvalid) {
        return null
    }

    return data
}

function handleSubmit() {
    if (props.isLoading) {
        return
    }

    const data = retreiveData()

    if (!data) {
        isFormValid.value = false
        return
    }

    emits("submitForm", data)
}

function setIsValid() {
    for (const element of props.elementsRefs) {
        if (!element.isValid()) {
            return
        }
    }

    emits("onValidState")
    isFormValid.value = true
}

function reset() {
    isFormValid.value = true
    for (const element of props.elementsRefs) {
        element.reset()
    }
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
