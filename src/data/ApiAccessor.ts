
export default class ApiAccessor {
    private static _instance: ApiAccessor

    private readonly initDate: string
    private readonly _refreshTokenEndpoint: string
    private readonly _tokenAccessor: IAuthTokenAccessor

    private _apiUrl: string

    private isRefreshingToken: boolean = false
    private pendingRequests: ((newAccessToken: string) => void)[] = []

    private constructor(
        tokenAccessor: IAuthTokenAccessor,
        refreshTokenEndpoint: string,
        apiUrl: string = process.env.API_URL || 'http://localhost:5000/api'
    ) {
        this._apiUrl = this.provideValidUrlOrThrow(apiUrl)
        this._tokenAccessor = tokenAccessor
        this._refreshTokenEndpoint = refreshTokenEndpoint.trim()

        if (this._refreshTokenEndpoint.startsWith('/')) {
            this._refreshTokenEndpoint = this._apiUrl + this._refreshTokenEndpoint
        } else if (!this._refreshTokenEndpoint.includes(this._apiUrl)) {
            this._refreshTokenEndpoint = this._apiUrl + '/' + this._refreshTokenEndpoint
        }

        this.initDate = new Date().toISOString()
    }

    static initalize(tokenAccessor: IAuthTokenAccessor, apiUrl: string, refreshTokenEndpoint: string) {
        if (!ApiAccessor._instance) {
            ApiAccessor._instance = new ApiAccessor(tokenAccessor, refreshTokenEndpoint, apiUrl)
        }
    }

    static get instance(): ApiAccessor {
        if (!ApiAccessor._instance) {
            throw new Error("ApiAccessor is not initialized. Call ApiAccessor.initalize() first.")
        }

        return ApiAccessor._instance
    }

    /**
     * @template T - first generic type of this function is type of data sent as a body of API endpoint request
     * @template U - second generic type is type of data deserialized from API response body
     * @param {AccessApiOptions<T>} options generic object with data required as a body of API endpoint request - data's generic type is type given as a first generic type of this function
     * @param authToken authorization bearer token if any
     * @returns {Promise<ApiAccessResponse<U>>} deserialized object of API response body of type given as a second generic type of this function or generated object with error message if request failed
     */
    static async callApi<T, U>(options: AccessApiOptions<T>, abortSignal?: AbortSignal): Promise<ApiAccessResponse<U>> {
        return ApiAccessor.instance.requestApi<T, U>(options, abortSignal)
    }

    async requestApi<T, U>(options: AccessApiOptions<T>, abortSignal?: AbortSignal): Promise<ApiAccessResponse<U>> {
        const request = this.createRequest(options, this._tokenAccessor.accessToken, abortSignal)

        const response = await this.fetchResponse<U>(request)

        if (response.errorType === ErrorResponseType.UNAUTHORIZED) {
            if (this.isRefreshingToken) {
                return new Promise((resolve) => {
                    this.addRefreshSubscriber(async (newAccessToken: string) => {
                        const newRequest = this.createRequest({ ...options }, newAccessToken, abortSignal)
                        resolve(await this.fetchResponse<U>(newRequest))
                    })
                })
            }

            this.isRefreshingToken = true

            return await this.processRefresh<T, U>({ ...options }, abortSignal)
        }

        return response
    }

    private async processRefresh<T, U>(options: AccessApiOptions<T>, abortSignal?: AbortSignal): Promise<ApiAccessResponse<U>> {
        return new Promise<ApiAccessResponse<U>>(resolve => setTimeout(async () => {
            let response: ApiAccessResponse<U> = {
                data: null,
                errorType: ErrorResponseType.UNAUTHORIZED,
                error: null,
                isError: true
            }

            if (!this._tokenAccessor.accessToken || !this._tokenAccessor.refreshToken || this._tokenAccessor.isRefreshTokenExpired()) {
                return resolve(response)
            }

            try {
                const tokenResponse = await fetch(`${this._apiUrl}user/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this._tokenAccessor.getRefreshPayload()),
                    signal: abortSignal
                })

                if (!tokenResponse.ok) {
                    throw new Error(tokenResponse.statusText)
                }

                // * API related response type 
                const tokenData: ApiResponse<unknown> = await tokenResponse.json()

                if (tokenData.isError) {
                    throw new Error('Token refresh failed')
                }

                this._tokenAccessor.setAuthTokens(tokenData.data)

                this.isRefreshingToken = false
                this.onTokenRefreshed(this._tokenAccessor.accessToken)

                const request = this.createRequest(options, this._tokenAccessor.accessToken, abortSignal)
                response = await this.fetchResponse<U>(request)
            } catch (err) {
                this.pendingRequests = []

                console.error('Processing refresh token: ', err)

                this._tokenAccessor.clearAuthTokens()
            } finally {
                this.isRefreshingToken = false
            }

            resolve(response)
        }, 50))
    }

    /**
     * there is application specific implementation of creating Request object
     * @param options generic object with data required for call API endpoint - generic type is type given as generic type of this function
     * @returns new object of build-in class Request
     */
    private createRequest<T>(options: AccessApiOptions<T>, accessToken: string | null, abortSignal?: AbortSignal): Request {

        const headers = new Headers({
            'x-api-key': this.initDate
        })

        if (accessToken) {
            headers.append('Authorization', `Bearer ${accessToken}`)
        }

        if (options.body) {
            headers.append('Content-Type', 'application/json')
        }

        let body = undefined
        if (options.body) {
            body = JSON.stringify(options.body)
        }

        const endpoint = options.endpoint.startsWith('/') ? options.endpoint.slice(1) : options.endpoint

        return new Request(this._apiUrl + endpoint, {
            method: options.method,
            headers: headers,
            body: body,
            signal: abortSignal
        })
    }

    private async generateApiResponse<T>(response: Response): Promise<ApiAccessResponse<T>> {
        let errorType: ErrorResponseType | null = null

        if (!response.ok) {
            if (response.status === 401) {
                errorType = ErrorResponseType.UNAUTHORIZED
            } else if (response.status === 403) {
                errorType = ErrorResponseType.FORBIDDEN
            } else if (response.status === 400) {
                errorType = ErrorResponseType.BAD_REQUEST
            } else if (response.status === 422) {
                errorType = ErrorResponseType.UNPROCESSABLE_ENTITY
            } else if (response.status === 404) {
                errorType = ErrorResponseType.NOT_FOUND
            } else if (response.status === 409) {
                errorType = ErrorResponseType.CONFLICT
            } else if (response.status >= 500) {
                errorType = ErrorResponseType.INTERNAL_SERVER_ERROR

                return {
                    data: null,
                    errorType,
                    error: 'Internal server error',
                    isError: true
                }
            } else {
                errorType = ErrorResponseType.UNKNOWN
            }
        }

        if (response.status === 204) {
            return {
                data: null,
                errorType,
                error: null,
                isError: false
            }
        }

        try {
            const responseData: ApiResponse<T> = await response.json()

            return {
                data: responseData.data,
                errorType,
                error: responseData.isError ? responseData.errors : null,
                isError: responseData.isError
            }
        } catch (err) {
            return {
                data: null,
                errorType,
                error: err instanceof Error ? { message: err.message } : 'Unknown error',
                isError: true
            }
        }
    }

    /**
     * call endpoint given in build-in Request object and return response deserialized from response body or generated according to response HTTP error code
     * @param {Request} request 
     * @returns {Promise<ApiAccessResponse<T>>} response with data object of generic type given as generic type of this function
     */
    private async fetchResponse<T>(request: Request): Promise<ApiAccessResponse<T>> {
        try {
            const response = await fetch(request)

            return this.generateApiResponse<T>(response)
        } catch (err) {
            let error = null

            if (err instanceof Error) {
                error = { message: err.message }
            }

            return {
                data: null,
                errorType: ErrorResponseType.UNKNOWN,
                error,
                isError: true
            }
        }
    }

    private onTokenRefreshed(accessToken: string) {
        this.pendingRequests.forEach(callback => {
            callback(accessToken)
        })
        this.pendingRequests = []
    }

    private addRefreshSubscriber(callback: (newAccessToken: string) => void) {
        this.pendingRequests.push(callback)
    }

    private provideValidUrlOrThrow(url: string): string {
        if (!url || typeof url !== "string") {
            throw new Error("Invalid API URL provided.")
        }

        url = url.trim()

        try {
            new URL(url)

            if (url.endsWith('/')) {
                return url
            }

            return url + '/'
        } catch {
            throw new Error("Invalid API URL provided.")
        }
    }
}

/**
 * backend API related response type
 * @template T - generic type of data sent by backend API
 */
export type ApiResponse<T> = {
    data: T
    errors: unknown | null
    isError: boolean
}

/**
 * @template T - generic type of data sent as a body of request to API endpoint
 */
export type AccessApiOptions<T> = {
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: T
}

export type ApiAccessResponse<T = null> = {
    data: T | null
    errorType: ErrorResponseType | null
    error: unknown | null
    isError: boolean
}

export enum ErrorResponseType {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    CONFLICT = 'CONFLICT',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNKNOWN = 'UNKNOWN'
}

export interface IAuthTokenAccessor {
    accessToken: string | null
    refreshToken: string | null
    setAuthTokens(authTokens: unknown): void
    clearAuthTokens(): void
    isRefreshTokenExpired(): boolean
    getRefreshPayload(): unknown
}