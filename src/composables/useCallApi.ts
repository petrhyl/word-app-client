import { RefreshTokenResponse } from "@/types/responses";
import useUserAuth from "./useUserAuth";

export type CallApiOptions<T> = {
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: T
}

export type ApiResponse<T> = {
    data: T;
    errors: any;
    isError: boolean;
}

export type ApiCallResponse<T = null> = {
    data: T | null;
    errorType: ErrorResponseType | null;
    error: any
    isError: boolean;
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

let isRefreshing = false;
let pendingCalls: Array<(newAccessToken: string) => void> = [];


function onTokenRefreshed(accessToken: string) {
    pendingCalls.forEach(callback => {
        callback(accessToken)
    })
    pendingCalls = []
}

function addRefreshSubscriber(callback: (newAccessToken: string) => void) {
    pendingCalls.push(callback);
}

/**
 * @param options generic object with data required for call API endpoint - generic type is type given as generic type of this function
 * @param authToken authorization token if any
 * @returns new object of build-in class Request
 */
function createRequest<T>(options: CallApiOptions<T>, authToken: string | null): Request {

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    })

    let body = undefined
    if (options.body) {
        body = JSON.stringify(options.body)
    }

    return new Request(import.meta.env.VITE_API_URL + options.endpoint, {
        method: options.method,
        headers: headers,
        body: body
    })
}

async function generateApiResponse<T>(response: Response): Promise<ApiCallResponse<T>> {
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
                error: null,
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
            error: err instanceof Error ? { message: err.message } : null,
            isError: true
        }
    }
}

/**
 * call endpoint given in build-in Request object and return response deserialized from response body or generated according to response HTTP error code
 * @param {Request} request 
 * @returns {Promise<ApiCallResponse<T>>} response with data object of generic type given as generic type of this function
 */
async function fetchResponse<T>(request: Request): Promise<ApiCallResponse<T>> {
    try {
        const response = await fetch(request)

        return generateApiResponse<T>(response)
    } catch (err) {
        console.error(err)

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

export default function useCallApi() {
    const { accessToken, refreshToken, setTokens, isRefreshTokenExpired, nullifyLogin } = useUserAuth()

    async function processRefresh<T, U>(options: CallApiOptions<T>): Promise<ApiCallResponse<U>> {
        return new Promise<ApiCallResponse<U>>(resolve => setTimeout(async () => {
            let response: ApiCallResponse<U> = {
                data: null,
                errorType: ErrorResponseType.UNAUTHORIZED,
                error: null,
                isError: true
            }

            if (!accessToken.value || !refreshToken.value || isRefreshTokenExpired()) {
                return resolve(response)
            }

            try {
                const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: accessToken.value,
                        refreshToken: refreshToken.value
                    })
                })

                if (!tokenResponse.ok) {
                    throw new Error(tokenResponse.statusText)
                }

                const tokenData: ApiResponse<RefreshTokenResponse> = await tokenResponse.json()

                if (tokenData.isError) {
                    throw new Error('Token refresh failed')
                }

                setTokens(tokenData.data.auth.token.accessToken,
                    tokenData.data.auth.token.accessTokenExpiresIn,
                    tokenData.data.auth.token.refreshToken,
                    tokenData.data.auth.token.refreshTokenExpireIn)

                isRefreshing = false;
                onTokenRefreshed(tokenData.data.auth.token.accessToken);

                const request = createRequest(options, tokenData.data.auth.token.accessToken)
                response = await fetchResponse<U>(request)
            } catch (err) {
                pendingCalls = []

                console.log(err);

                nullifyLogin()
            } finally {
                isRefreshing = false
            }

            resolve(response)
        }, 100))
    }

    /**
     * @template T - first generic type of this function is type of data sent as a body of API endpoint request
     * @template U - second generic type is type of data deserialized from API response body
     * @param {CallApiOptions<T>} options generic object with data required as a body of API endpoint request - data's generic type is type given as a first generic type of this function
     * @param authToken authorization bearer token if any
     * @returns {Promise<ApiCallResponse<U>>} deserialized object of API response body of type given as a second generic type of this function or generated object with error message if request failed
     */
    async function callApi<T, U>(options: CallApiOptions<T>): Promise<ApiCallResponse<U>> {
        const request = createRequest(options, accessToken.value)

        const response = await fetchResponse<U>(request)

        if (response.errorType === ErrorResponseType.UNAUTHORIZED) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(async (newAccessToken: string) => {
                        const newRequest = createRequest({ ...options }, newAccessToken)
                        resolve(await fetchResponse<U>(newRequest))
                    });
                });
            }

            isRefreshing = true;

            return await processRefresh<T, U>({ ...options })
        }

        return response
    }

    return { callApi }
}