<template>
    <div class="element">
        <label :for="id">{{ label }}</label>
        <div :class="getCssClasses">
            <select :id="id" :value="selectedValue.label" @change="handleChange" @click="handleOpen" @blur="handleBlur">
                <option class="select-option" v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
            <FadeTransition>
                <div v-if="isOpen" class="options-container">
                    <div
                        v-for="val in options"
                        class="selection-option"
                        :class="{ 'font-semibold': val.value === selectedValue.value }"
                        @click="handleSelect(val)"
                    >
                        {{ val.label }}
                        <div class="check-icon-container">
                            <CheckIcon v-if="val.value === selectedValue.value" class="check-icon" />
                        </div>
                    </div>
                </div>
            </FadeTransition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElementExposedFunctions, SelectionElementProps, SelectionOptionProps } from "./FormElementProps"
import FadeTransition from "@/components/transitions/FadeTransition.vue"
import { CheckIcon } from "@heroicons/vue/16/solid"

const props = defineProps<SelectionElementProps>()

defineExpose<ElementExposedFunctions>({
    getId,
    getValue,
    isValid,
    reset
})

function resolveDefaultValue() {
    return props.defaultValue
        ? props.options.find(o => o.value === props.defaultValue) || props.options[0]
        : props.options[0]
}

const selectedValue = ref<SelectionOptionProps>(resolveDefaultValue())
const isOpen = ref<boolean>(false)
const isBlured = ref<boolean>(false)

const isWarningDisplayed = computed<boolean>(() => {
    return !isValid && (isBlured.value || props.isFormSubmitted)
})
const getCssClasses = computed<string>(() => {
    let css = isWarningDisplayed.value ? "invalid" : "valid"
    if (isOpen.value) {
        css += " ring-blue-400 ring ring-opacity-40"
    }

    return css
})

function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement
    const option = props.options.find(o => o.value === target.value)
    if (option) {
        selectedValue.value = option
    }
}

function handleOpen() {
    isOpen.value = !isOpen.value
}

function handleSelect(value: SelectionOptionProps) {
    selectedValue.value = value
}

function handleBlur() {
    isBlured.value = true
    isOpen.value = false
}

function getId() {
    return props.id
}

function getValue(): string {
    return selectedValue.value.value
}

function isValid(): boolean {
    return props.validateInput(selectedValue.value.value)
}

function reset() {
    selectedValue.value = resolveDefaultValue()
}
</script>

<style lang="css" scoped>
select option {
    display: none;
}

.element-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.element {
    position: relative;
    width: 100%;
    border-radius: 5px;
    border-width: 2px;
    border-style: solid;
}

.options-container {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    top: calc(100% + 0.5rem);
    max-height: 8rem;
    overflow: auto;
    border-radius: 5px;
}

.selection-option {
    position: relative;
    width: 100%;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-left: 1.25rem;
    padding-right: 2.5rem;
    cursor: pointer;
    transition: all 0.17s;
}

.check-icon-container {
    position: absolute;
    right: 0.5rem;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
}

.check-icon {
    width: 1.5rem;
    height: 1.5rem;
    stroke-width: 2;
}

.valid {
}

.invalid {
    border-color: var(--warning-color);
}
</style>
