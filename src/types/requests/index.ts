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