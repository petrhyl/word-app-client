import { AppUser, AuthToken } from "../models";

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
    retistration: {
        userEmail: string
        message: string
    }
}

export type LoginResponse = {
    auth: AuthResponse
}