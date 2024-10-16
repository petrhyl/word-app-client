import { useAuthStore } from "@/store/user/authStore";
import { RefreshTokenResponse } from "@/types/responses";

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
    isError: boolean;
}

export enum ErrorResponseType {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNKNOWN = 'UNKNOWN'
}

let isRefreshing = false;
let pendingCalls: Array<(newAccessToken: string) => void> = [];
let refreshFailed = false;


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
    if (!response.ok) {
        let errorType: ErrorResponseType = ErrorResponseType.UNKNOWN
        if (response.status === 401) {
            errorType = ErrorResponseType.UNAUTHORIZED
        } else if (response.status === 403) {
            errorType = ErrorResponseType.FORBIDDEN
        } else if (response.status === 400 || response.status === 422) {
            errorType = ErrorResponseType.BAD_REQUEST
        } else if (response.status === 404) {
            errorType = ErrorResponseType.NOT_FOUND
        } else if (response.status === 500) {
            errorType = ErrorResponseType.INTERNAL_SERVER_ERROR
        }

        return {
            data: null,
            errorType,
            isError: true
        }

    }

    const data: ApiResponse<T> = await response.json()

    return {
        data: data.data,
        errorType: null,
        isError: false
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
    } catch (error) {
        console.error(error)

        return {
            data: null,
            errorType: ErrorResponseType.UNKNOWN,
            isError: true
        }
    }
}

export default function useCallApi() {
    const { accessToken, refreshToken, setTokens, isRefreshTokenExpired, nullifyTokens } = useAuthStore()

    /**
     * @param options generic object with data required as a body of API endpoint request - data's generic type is type given as a first generic type of this function
     * @param authToken authorization bearer token if any
     * @returns deserialized object of API response body of type given as a second generic type of this function or generated object with error message if request failed
     */
    async function callApi<T, U>(options: CallApiOptions<T>): Promise<ApiCallResponse<U>> {
        const request = createRequest(options, accessToken)

        const response = await fetchResponse<U>(request)

        if (response.errorType === ErrorResponseType.UNAUTHORIZED && !refreshFailed) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(async (newAccessToken: string) => {
                        request.headers.set('Authorization', `Bearer ${newAccessToken}`)
                        resolve(await fetchResponse<U>(request))
                    });
                });
            }

            isRefreshing = true;

            try {
                if (!accessToken || !refreshToken || isRefreshTokenExpired()) {
                    nullifyTokens()

                    return {
                        data: null,
                        errorType: ErrorResponseType.UNAUTHORIZED,
                        isError: true
                    }
                }

                const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
                })

                if (!tokenResponse.ok) {
                    throw new Error(tokenResponse.statusText)
                }

                const tokenData: ApiResponse<RefreshTokenResponse> = await tokenResponse.json()

                if (tokenData.isError) {
                    throw new Error('Token refresh failed')
                }

                setTokens(tokenData.data.auth.token.accessToken, tokenData.data.auth.token.accessTokenExpiresIn, tokenData.data.auth.token.refreshToken, tokenData.data.auth.token.refreshTokenExpireIn)

                isRefreshing = false;
                onTokenRefreshed(tokenData.data.auth.token.accessToken);
            } catch (err) {
                refreshFailed = true
                pendingCalls = []
                nullifyTokens()
            } finally {
                isRefreshing = false
            }
        }

        return response
    }

    return { callApi }
}