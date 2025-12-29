import type { ResponseDataProps } from "../interfaces/services"

export const defaultResponse = <T extends any>(data: T): ResponseDataProps<T> => {
    return ({
        error: false,
        data: data as T,
        status: 200,
        message: '',
        isLoaded: false
    })
}