export type FormElementProps = {
    id: string
    label: string
    validationMessage: string
    defaultValue?: string
    tabIndex?: number
    validateInput: (value: string | File | null) => boolean;
}

export type ElementExposedFunctions = {
    getId: () => string
    getValue: () => string | File | null
    isValid: () => boolean
    reset: () => void
    setIsFormSubmitted: () => void
}

export type InputElementProps = {
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'watch-password'
    placeholder?: string
    notAutoComplete?: boolean
} & FormElementProps

export type SelectionOptionProps = {
    label: string
    value: string
}

export type SelectionElementProps = {
    options: SelectionOptionProps[];
} & FormElementProps

export type TextElementProps = {
    rows: number
    placeholder?: string
} & FormElementProps