export type FormElementProps = {
    id: string
    label: string
    validationMessage: string
    defaultValue?: string
    isFormSubmitted: boolean
    validateInput: (value: string | File | null) => boolean;
}

export type ElementExposedFunctions = {
    getId: () => string
    getValue: () => string | File | null
    isValid: () => boolean
    reset: () => void
}

export type InputElementProps = {
    type: 'text' | 'email' | 'password' | 'number' | 'date'
    placeholder?: string
} & FormElementProps

export type SelectionOptionProps = {
    label: string
    value: string
}

export type SelectionElementProps = {
    options: SelectionOptionProps[];
} & FormElementProps

