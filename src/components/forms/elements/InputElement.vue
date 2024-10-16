<template>
    <div class="element-container">
        <div class="label-container">
            <label :for="props.id">{{ props.label }}</label>
            <span v-if="isWarningDisplayed" class="warning">{{ props.validationMessage }}</span>
        </div>
        <div class="input-wrapper" :class="isWarningDisplayed ? 'invalid' : 'valid'">
            <input
                :id="props.id"
                :type="getInputType"
                v-model.trim="value"
                :placeholder="placeholder"
                @blur="handleBlur"
                @input="validate"
            />
            <div v-if="props.type === 'watch-password'" class="watch-icon-wrapper">
                <EyeSlashIcon v-if="isPasswordVisible" class="watch-icon" @click="isPasswordVisible = false" />
                <EyeIcon v-else class="watch-icon" @click="isPasswordVisible = true" />
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
const getInputType = computed(() => {
    if (isPasswordVisible.value && props.type === "watch-password") {
        return "text"
    }

    if (props.type === "watch-password") {
        return "password"
    }

    return props.type
})

function validate() {
    if (isValid()) {
        emits("onValidate")
    }
}

function handleBlur() {
    if (value.value) {
        isBlured.value = true
    }
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
    display: inline;
}

.label-container label {
    font-family: var(--title-font);
    color: var(--title-font-color);
    font-size: 1.15rem;
    padding-right: 0.5rem;
    padding-left: calc(0.75rem + 2px);
}

.warning {
    color: var(--warning-color);
    font-size: 0.75rem;
}

.input-wrapper {
    width: 100%;
    display: flex;
    background-color: #002931d3;
    border-width: 2px;
    border-style: solid;
    border-radius: 5px;
    padding: 0.75rem 0.75rem;
}

.input-wrapper input {
    width: 100%;
    background-color: transparent;
    color: var(--primary-font-color);
    font-family: var(--paragraph-font);
    font-size: 1rem;
}

.input-wrapper input::placeholder {
    color: var(--secondary-font-color);
}

.valid {
    border-color: var(--form-border-color);
}

.invalid {
    border-color: var(--warning-color);
}

.watch-icon-wrapper {
    display: flex;
    align-items: center;
}

.watch-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--title-font-color);
    stroke-width: 2px;
    cursor: pointer;
}
</style>
