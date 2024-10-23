export type AppUser = {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
}

export type AuthToken = {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpireIn: number;
}

export type AuthUser = {
    user: AppUser;
    token: AuthToken;
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