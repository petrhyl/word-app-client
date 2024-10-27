import { AppLanguage, AppUser, AuthToken, UserVocabularyLanguage } from "../models";

export type RefreshTokenResponse = {
    auth: {
        token: AuthToken
    }
}

export type UserResponse = {
    user: AppUser
}

export type AuthResponse = {
    user: AppUser
    token: AuthToken
}

export type UserRegistrationResponse = {
    auth?: AuthResponse
    registration?: {
        userEmail: string
        message: string
    }
}

export type LoginResponse = {
    auth: AuthResponse
}

export type LanguageResponse = {
    languages: AppLanguage[]
}

export type UserVocabularyLanguagesResponse = {
    languages: UserVocabularyLanguage[]
}

export type VocabularyItem = {
    id: number
    word: string
    translations: string[]
    correctAnswers: number
    isLearned: boolean | null
    updatedAt: Date
}

export type ExerciseResponse = {
    exercise: {
        languageId: number
        languageCode: string
        languageName: string
        words: VocabularyItem[]
    }
}

export type LanguageVocabulary = {
    language: UserVocabularyLanguage
    items: VocabularyItem[]
}

export type LanguageVocabularyResponse = {
    vocabulary: LanguageVocabulary
}