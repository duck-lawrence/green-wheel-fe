import axios from "axios"
import { BackendError } from "@/models/common/response"

export const requestWrapper = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
        return await fn()
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data
            const backendError: BackendError = {
                title: data?.title ?? "Internal Server Error",
                status: data?.status ?? error.response?.status,
                detail: data?.detail ?? error.message
            }
            throw backendError
        }
        throw {
            title: "Internal Server Error",
            status: 500,
            detail: "common.unexpected_error"
        }
    }
}

export const buildQueryParams = (obj: Record<string, any>, ignoreFalsy = false) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => (ignoreFalsy ? Boolean(v) : v != null && v !== ""))
    )
}
