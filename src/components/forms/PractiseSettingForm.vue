<template>
    <FormCard>
        <form @submit.prevent="handleSubmit">
            <SelectionElement
                ref="selectLangRef"
                :id="'select-lang'"
                label="Choose vocabulary language"
                :validation-message="''"
                :is-form-submitted="isSubmitted"
                :validate-input="validateSelect"
                :tab-index="1"
                :options="props.languages"
            />
            <SelectionElement
                ref="selectAmountRef"
                :id="'select-limit'"
                label="Choose amount of words"
                :validation-message="''"
                :is-form-submitted="isSubmitted"
                :validate-input="validateSelect"
                :tab-index="2"
                :options="props.amounts"
            />
            <AppButton :type="'submit'" :style="'primary'" :is-submitting="isLoading">
                Start Exercise
            </AppButton>
        </form>
    </FormCard>
</template>

<script setup lang="ts">
import { ExerciseQueryParams } from "@/types/requests"
import { SelectionOptionProps } from "./elements/FormElementProps"
import FormCard from "../ui/form/FormCard.vue"
import SelectionElement from "./elements/SelectionElement.vue"
import { ref } from "vue"
import AppButton from "../ui/button/AppButton.vue"

const props = defineProps<{
    isLoading: boolean
    languages: SelectionOptionProps[]
    amounts: SelectionOptionProps[]
}>()

const emits = defineEmits<{
    onSubmit: [data: ExerciseQueryParams]
}>()

const isSubmitted = ref(false)
const selectLangRef = ref<InstanceType<typeof SelectionElement> | null>(null)
const selectLimitRef = ref<InstanceType<typeof SelectionElement> | null>(null)

function validateSelect(_value: any): boolean {
    return true
}

function handleSubmit() {
    if (props.isLoading) {
        return
    }
    
    isSubmitted.value = true

    const langId = parseInt(selectLangRef.value?.getValue() as string)
    const limit = parseInt(selectLimitRef.value?.getValue() as string)

    emits('onSubmit', { langId, limit })
}
</script>

<style lang="css" scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
