export type ExerciseQueryParams = {
    langId: number
    limit: number
}

export type UserRegistration = {
    email: string
    name: string
    password: string
    language: string
}

export type UserLogin = {
    email: string
    password: string
}

export type UserLogout = {
    userId: number
    refreshToken: string
}

export type ChangePasswordRequest = {
    previousPassword: string
    newPassword: string
}

export type ForgetPasswordRequest = {
    email: string
}

export type SendVerificationEmailRequest = ForgetPasswordRequest

export type ResetPasswordRequest = {
    password: string
    verificationKey: string
}

export type VocabularyItemRequest = {
    word: string
    translations: string[]
}

export type CreateVocabularyRequest = {
    languageId: number
    vocabularyItems: VocabularyItemRequest[]
}

export type ExerciseResultItem = {
    id: number
    isAnswredCorrectly: boolean
}

export type ExerciseResultRequest = {
    languageId: number
    words: ExerciseResultItem[]
}

export type CheckWordRequest = {
    word: string
    languageId: number
}

export type UpdateVocabularyItemRequest = {
    languageId: number
} & VocabularyItemRequest