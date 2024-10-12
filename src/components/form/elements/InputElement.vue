<template>
    <div></div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElementExposedFunctions, InputElementProps } from "./FormElementProps"

const props = defineProps<InputElementProps>()

defineExpose<ElementExposedFunctions>({
    getId,
    getValue,
    isValid,
    reset
})

const value = ref<string | number | null>(props.defaultValue || null)
const isBlured = ref<boolean>(false)

function handleBlur() {
    isBlured.value = true
}

function getId() {
    return props.id
}

function getValue(): string | null {
    return value.value === null ? null : value.value.toString()
}

function isValid(): boolean {
    return props.validateInput(value.value === null ? "" : value.value.toString())
}

function reset() {
    value.value = props.defaultValue || null
}
</script>
