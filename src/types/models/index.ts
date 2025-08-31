export type AppUser = {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
}

export type AuthToken = {
    token: string;
    expiresIn: number;
}

export type AppLanguage = {
    code: string
    name: string
}

export type UserVocabularyLanguage = {
    id: number
    userId: number
    code: string
    name: string
}

export type VocabularyStats = {
    language: UserVocabularyLanguage
    successRate: number
    totalAnsweredWords: number
    answeredWordsAverage: number
}