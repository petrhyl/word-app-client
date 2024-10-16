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