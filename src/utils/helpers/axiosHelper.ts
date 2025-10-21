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

export const debouncedWrapper = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay = 800
) => {
    let timeoutRef: ReturnType<typeof setTimeout> | null = null
    let abortController: AbortController | null = null

    const debouncedFn = (
        ...args: Parameters<T>
    ): Promise<ReturnType<T> extends Promise<infer R> ? R : never> => {
        return new Promise((resolve, reject) => {
            // Huỷ các lần gọi trước
            if (timeoutRef) {
                clearTimeout(timeoutRef)
                timeoutRef = null
            }
            if (abortController) {
                abortController.abort()
                abortController = null
            }

            // Tạo AbortController mới
            abortController = new AbortController()
            const signal = abortController.signal

            // Đặt timeout để gọi hàm sau khi người dùng dừng thao tác
            timeoutRef = setTimeout(async () => {
                try {
                    const result = await fn(...args)
                    resolve(result)
                } catch (error) {
                    if (signal.aborted) {
                        reject(new Error("Operation aborted"))
                    } else {
                        reject(error)
                    }
                } finally {
                    // Reset
                    timeoutRef = null
                    abortController = null
                }
            }, delay)
        })
    }

    // Thêm phương thức cancel để huỷ debounce
    debouncedFn.cancel = () => {
        if (timeoutRef) {
            clearTimeout(timeoutRef)
            timeoutRef = null
        }
        if (abortController) {
            abortController.abort()
            abortController = null
        }
    }

    return debouncedFn
}
