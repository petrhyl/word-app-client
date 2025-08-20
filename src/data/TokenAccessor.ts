import { AuthToken } from "@/types/models"
import { IAuthTokenAccessor } from "./ApiAccessor"
import { RefreshTokenResponse } from "@/types/responses"

export default class TokenAccessor implements IAuthTokenAccessor {
    private static readonly ACCESS_TOKEN_KEY = 'aut-w'
    private static readonly ACCESS_TOKEN_EXPIERY_KEY = 'eaut-w'
    private static readonly REFRESH_TOKEN_KEY = 'rut-w'
    private static readonly REFRESH_TOKEN_EXPIERY_KEY = 'erut-w'

    private _accessToken: string | null
    private _refreshToken: string | null
    private _accessTokenExpiry: number | null
    private _refreshTokenExpiry: number | null

    private static _instance: TokenAccessor | null = null

    constructor() {
        this._accessToken = localStorage.getItem(TokenAccessor.ACCESS_TOKEN_KEY)
        const accessTokenExpiry = localStorage.getItem(TokenAccessor.ACCESS_TOKEN_EXPIERY_KEY)
        this._accessTokenExpiry = accessTokenExpiry ? parseInt(accessTokenExpiry, 10) : null
        this._refreshToken = localStorage.getItem(TokenAccessor.REFRESH_TOKEN_KEY)
        const refreshTokenExpiry = localStorage.getItem(TokenAccessor.REFRESH_TOKEN_EXPIERY_KEY)
        this._refreshTokenExpiry = refreshTokenExpiry ? parseInt(refreshTokenExpiry, 10) : null
    }

    static get instance(): TokenAccessor {
        if (!this._instance) {
            this._instance = new TokenAccessor()
        }

        return this._instance
    }

    get accessToken(): string | null {
        return this._accessToken
    }

    get refreshToken(): string | null {
        return this._refreshToken
    }

    get accessTokenExpiry(): Date | null {
        return this._accessTokenExpiry ? new Date(this._accessTokenExpiry) : null
    }

    get refreshTokenExpiry(): Date | null {
        return this._refreshTokenExpiry ? new Date(this._refreshTokenExpiry) : null
    }

    setAuthTokens(authTokens: RefreshTokenResponse | AuthToken): void {
        let tokenObject: AuthToken
        if ('auth' in authTokens) {
            tokenObject = authTokens.auth.token
        } else {
            tokenObject = authTokens as AuthToken
        }

        this._accessToken = tokenObject.accessToken
        this._refreshToken = tokenObject.refreshToken
        this._accessTokenExpiry = tokenObject.accessTokenExpiresIn
        this._refreshTokenExpiry = tokenObject.refreshTokenExpiresIn

        localStorage.setItem(TokenAccessor.ACCESS_TOKEN_KEY, this._accessToken)
        localStorage.setItem(TokenAccessor.ACCESS_TOKEN_EXPIERY_KEY, this._accessTokenExpiry.toString())
        localStorage.setItem(TokenAccessor.REFRESH_TOKEN_KEY, this._refreshToken)
        localStorage.setItem(TokenAccessor.REFRESH_TOKEN_EXPIERY_KEY, this._refreshTokenExpiry.toString())
    }

    clearAuthTokens(): void {
        this._accessToken = null
        this._refreshToken = null
        this._accessTokenExpiry = null
        this._refreshTokenExpiry = null

        localStorage.removeItem(TokenAccessor.ACCESS_TOKEN_KEY)
        localStorage.removeItem(TokenAccessor.ACCESS_TOKEN_EXPIERY_KEY)
        localStorage.removeItem(TokenAccessor.REFRESH_TOKEN_KEY)
        localStorage.removeItem(TokenAccessor.REFRESH_TOKEN_EXPIERY_KEY)
    }

    getRefreshPayload(): unknown {
        return {
            accessToken: this._accessToken,
            refreshToken: this._refreshToken
        }
    }

    isRefreshTokenExpired(): boolean {
        return this._refreshTokenExpiry !== null && this._refreshTokenExpiry < Date.now() - 3000
    }
}