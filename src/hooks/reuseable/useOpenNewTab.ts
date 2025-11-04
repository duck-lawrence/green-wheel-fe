import { useCallback } from "react"
import type { MouseEvent } from "react"

type OpenNewTabHandler = (event?: MouseEvent<HTMLElement>, pathOverride?: string) => void

export const useOpenNewTab = (defaultPath?: string): OpenNewTabHandler => {
    const openNewTab = useCallback<OpenNewTabHandler>(
        (event, pathOverride) => {
            if (event) {
                //chặn hành vi mặc định của trình duyệt (như chuyển trang).
                event.preventDefault()
                //ngăn sự kiện lan lên các phần tử cha (tránh bug khi có onClick lồng nhau).
                event.stopPropagation()
            }

            if (typeof window === "undefined") return

            let targetUrl = pathOverride ?? defaultPath

            if (!targetUrl && event?.currentTarget) {
                const currentTarget = event.currentTarget as HTMLElement & {
                    href?: string
                }

                targetUrl =
                    currentTarget?.getAttribute?.("href") ??
                    currentTarget?.getAttribute?.("data-href") ??
                    currentTarget?.href ??
                    undefined
            }

            if (!targetUrl) return

            let absoluteUrl = targetUrl

            try {
                absoluteUrl = new URL(targetUrl, window.location.origin).toString()
            } catch {
                // fallback to original string if URL constructor fails
            }

            window.open(absoluteUrl, "_blank", "noopener,noreferrer")
        },
        [defaultPath]
    )

    return openNewTab
}

