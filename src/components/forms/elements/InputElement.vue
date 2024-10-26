<template>
    <div class="element-container">
        <ElementLable
            :forId="id"
            :label="label"
            :validationMessage="validationMessage"
            :isWarningDisplayed="isWarningDisplayed"
        />
        <div class="input-wrapper" :class="isWarningDisplayed ? 'invalid' : 'valid'">
            <input
                :id="props.id"
                :type="getInputType"
                v-model.trim="value"
                :placeholder="placeholder"
                @blur="handleBlur"
                @input="validate"
                @paste="handlePaste"
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
import ElementLable from "./ElementLable.vue"

const props = defineProps<InputElementProps>()

const emits = defineEmits(["onValidate"])

defineExpose<ElementExposedFunctions>({
    getId,
    getValue,
    isValid,
    reset,
    setIsFormSubmitted
})

const value = ref<string | number | null>(props.defaultValue || null)
const isBlured = ref<boolean>(false)
const isPasswordVisible = ref<boolean>(false)
const isFormSubmitted = ref<boolean>(false)

const isWarningDisplayed = computed<boolean>(() => {
    return !isValid() && ((isBlured.value && value.value !== null) || isFormSubmitted.value)
})
const getInputType = computed(() => {
    if ((isPasswordVisible.value && props.type === "watch-password") || props.type === "email") {
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

function handlePaste(event: ClipboardEvent) {
    if (props.type === "password") {
        event.preventDefault()
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

function setIsFormSubmitted() {
    isFormSubmitted.value = true
}
</script>

<style lang="css" scoped>
.element-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
}

.input-wrapper {
    position: relative;
    width: 100%;
    background-color: var(--element-bg-color);
    border-width: 2px;
    border-style: solid;
    border-radius: var(--border-radius);
}

.input-wrapper input {
    width: 100%;
    background-color: var(--element-bg-color);
    color: var(--primary-font-color);
    font-family: var(--paragraph-font);
    font-size: 1rem;
    border-radius: var(--border-radius);
    padding: 0.75rem 0.75rem;
}
input:focus {
    box-shadow: var(--focus-shadow);
}

.input-wrapper input:-webkit-autofill {
    background-color: #002931d3 !important;
    color: #f2e0ff !important;
    appearance: none !important;
}

.input-wrapper input::placeholder {
    color: var(--secondary-font-color);
    font-family: var(--paragraph-font);
}

.valid {
    border-color: var(--card-border-color);
}

.invalid {
    border-color: var(--warning-color);
}

.watch-icon-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-right: 0.75rem;
}

.watch-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--title-font-color);
    stroke-width: 2px;
    cursor: pointer;
}
</style>
