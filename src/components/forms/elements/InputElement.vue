<template>
    <div class="element-container">
        <div class="label-container">
            <label :for="props.id">{{ props.label }}</label>
            <span v-if="isWarningDisplayed" class="warning">{{ props.validationMessage }}</span>
            <div class="input-wrapper">
                <input :id="props.id" :type="props.type" v-model.trim="value" @blur="handleBlur" @input="validate" />
                <div v-if="props.type === 'password'" class="watch-icon-wrapper">
                    <EyeSlashIcon v-if="isPasswordVisible" @click="isPasswordVisible = false" />
                    <EyeIcon v-else @click="isPasswordVisible = true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElementExposedFunctions, InputElementProps } from "./FormElementProps"
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/16/solid"

const props = defineProps<InputElementProps>()

const emits = defineEmits(["onValidate"])

defineExpose<ElementExposedFunctions>({
    getId,
    getValue,
    isValid,
    reset
})

const value = ref<string | number | null>(props.defaultValue || null)
const isBlured = ref<boolean>(false)
const isPasswordVisible = ref<boolean>(false)

const isWarningDisplayed = computed<boolean>(() => {
    return !isValid() && ((isBlured.value && value.value !== null) || props.isFormSubmitted)
})

function validate() {
    if (isValid()) {
        emits("onValidate")
    }
}

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

<style lang="css" scoped>
.element-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
}

.label-container {
    display: inline-flex;
}

.input-wrapper {
    position: relative;
    width: 100%;
    border-width: 2px;
    border-style: solid;
}

.watch-icon-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
}

.valid {
    border-color: var(--form-border-color);
}

.invalid {
    border-color: var(--warning-color);
}
</style>
