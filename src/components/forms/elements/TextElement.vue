<template>
    <div class="element-container">
        <ElementLable
            :forId="id"
            :label="label"
            :validationMessage="validationMessage"
            :isWarningDisplayed="isWarningDisplayed"
        />
            <textarea
            class="text-element" :class="isWarningDisplayed ? 'invalid' : 'valid'"
                :id="props.id"
                v-model.trim="value"
                :placeholder="placeholder"
                :rows="rows"
                @blur="handleBlur"
                @input="validate"
            ></textarea>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElementExposedFunctions, TextElementProps } from "./FormElementProps"
import ElementLable from "./ElementLable.vue"

const props = defineProps<TextElementProps>()

const emits = defineEmits(["onValidate"])

defineExpose<ElementExposedFunctions>({
    getId,
    getValue,
    isValid,
    reset,
    setIsFormSubmitted
})

const value = ref<string>(props.defaultValue || "")
const isBlured = ref<boolean>(false)
const isFormSubmitted = ref<boolean>(false)

const isWarningDisplayed = computed<boolean>(() => {
    return !isValid() && ((isBlured.value && value.value !== null) || isFormSubmitted.value)
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
    return props.validateInput(value.value)
}

function reset() {
    value.value = props.defaultValue || ""
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

.text-element {
    width: 100%;
    background-color: var(--element-bg-color);
    color: var(--primary-font-color);
    font-family: var(--paragraph-font);
    font-size: 1rem;
    border-radius: var(--border-radius);
    border-width: 2px;
    border-style: solid;
    resize: none;
    padding: 0.75rem 0.75rem;
}

textarea:-webkit-autofill {
    background-color: #002931d3 !important;
    color: #f2e0ff !important;
    appearance: none !important;
}

textarea::placeholder {
    color: var(--secondary-font-color);
    font-family: var(--paragraph-font);
}

textarea:focus {
    box-shadow: var(--focus-shadow);
}

.valid {
    border-color: var(--card-border-color);
}

.invalid {
    border-color: var(--warning-color);
}
</style>
