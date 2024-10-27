<template>
    <div class="element-container">
        <ElementLable
            :for-id="id"
            :label="label"
            :validation-message="validationMessage"
            :is-warning-displayed="isWarningDisplayed"
            :is-label="false"
        />
        <div class="element" :class="isWarningDisplayed ? 'invalid' : 'valid'">
            <div class="default-select-container">
                <select :id="`default-${id}`" class="select-element default" :tabindex="tabIndex" @change="handleChange" @blur="handleBlur">
                    <option class="select-option" v-for="option in options" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
                <div class="icon-container">
                    <ChevronUpDownIcon class="icon" />
                </div>
            </div>
            <div
                :id="`custom-${id}`"
                class="select-element custom"
                :tabindex="tabIndex"
                @click="handleToggle"
                @blur="handleBlur"
                @keypress="handleKeypress"
            >
                {{ selectedValue.label }}
                <div class="icon-container">
                    <ChevronDownIcon class="icon" :class="isOpen ? 'open' : 'close'" />
                </div>
                <ExpandCollapseTransition>
                    <div v-if="isOpen" class="options-container">
                        <div
                            v-for="val in options"
                            class="selection-option"
                            :class="{ selected: val.value === selectedValue.value }"
                            @click="handleSelect(val)"
                        >
                            {{ val.label }}
                            <div class="icon-container">
                                <CheckIcon v-if="val.value === selectedValue.value" class="icon" />
                            </div>
                        </div>
                    </div>
                </ExpandCollapseTransition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElementExposedFunctions, SelectionElementProps, SelectionOptionProps } from "./FormElementProps"
import { CheckIcon, ChevronDownIcon, ChevronUpDownIcon } from "@heroicons/vue/24/solid"
import ElementLable from "./ElementLable.vue"
import ExpandCollapseTransition from "@/components/transitions/ExpandCollapseTransition.vue"

const props = defineProps<SelectionElementProps>()

const emits = defineEmits(["onValidate"])

defineExpose<ElementExposedFunctions>({
    getId,
    getValue,
    isValid,
    reset,
    setIsFormSubmitted
})

function resolveDefaultValue() {
    if (props.options.length === 0) {
        return { value: "", label: "" }
    }

    if (props.defaultValue) {
        return props.options.find(o => o.value === props.defaultValue) || props.options[0]
    }

    return props.options[0]
}

const selectedValue = ref<SelectionOptionProps>(resolveDefaultValue())
const isOpen = ref<boolean>(false)
const isBlured = ref<boolean>(false)
const isFormSubmitted = ref<boolean>(false)

const isWarningDisplayed = computed<boolean>(() => {
    return !isValid && (isBlured.value || isFormSubmitted.value)
})

function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement
    const option = props.options.find(o => o.value === target.value)
    if (option) {
        validate()
        selectedValue.value = option
    }
}

function handleToggle() {
    isOpen.value = !isOpen.value
}

function handleKeypress(ev: KeyboardEvent) {
    if (ev.key === "Enter") {
        handleToggle()
    }
}

function handleSelect(value: SelectionOptionProps) {
    validate()
    selectedValue.value = value
}

function handleBlur() {
    isBlured.value = true
    isOpen.value = false
}

function validate() {
    if (isValid()) {
        emits("onValidate")
    }
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

.element {
    width: 100%;
    border-radius: var(--border-radius);
    border-width: 2px;
    border-style: solid;
}

.select-element {
    width: 100%;
    background-color: var(--element-bg-color);
    color: var(--primary-font-color);
    font-family: var(--paragraph-font);
    font-size: 1rem;
    border-radius: var(--border-radius);
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0.75rem 0.75rem;
}

.select-element:hover {
    box-shadow: var(--focus-shadow);
}

.select-element:focus {
    box-shadow: var(--focus-shadow);
}

.default-select-container {
    position: relative;
    display: none;
}

.select-element.default {
    appearance: none;
}
.select-element.custom {
    position: relative;
    display: block;
}

.options-container {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    top: calc(100% + 0.5rem);
    max-height: 12rem;
    overflow: auto;
    border-radius: var(--border-radius);
    border: var(--card-border);
    background-color: var(--secondary-bg-color);
    padding: 0.5rem 0;
}

.selection-option {
    position: relative;
    width: 100%;
    cursor: pointer;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    transition: all 0.17s;
}

.selection-option:hover {
    background-color: var(--element-bg-color);
}

.selection-option.selected {
    color: var(--success-color);
}

.icon-container {
    position: absolute;
    right: 0.75rem;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
}

.icon {
    width: 1.5rem;
    height: 1.5rem;
    stroke: var(--primary-font-color);
    stroke-width: 2px;
    transition: all 0.17s ease-in-out;
}

.icon.open {
    transform: rotate(180deg);
}

.valid {
    border-color: var(--card-border-color);
}

.invalid {
    border-color: var(--warning-color);
}

@media screen and (max-width: 980px) {
    .select-element.custom {
        display: none;
    }

    .default-select-container {
        display: block;
        width: 100%;
        border-radius: var(--border-radius);
    }
}
</style>
