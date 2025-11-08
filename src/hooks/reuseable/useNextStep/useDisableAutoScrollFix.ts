"use client"
import { useEffect } from "react"

export function DisableAutoScrollFix() {
    useEffect(() => {
        const original = Element.prototype.scrollIntoView
        Element.prototype.scrollIntoView = function (arg?: boolean) {
            // Ngăn auto scroll khi phần tử đang ở giữa viewport
            const rect = this.getBoundingClientRect()
            const isInView =
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)

            if (!isInView) {
                // Nếu chưa nằm trong viewport thì mới scroll
                original.call(this, arg)
            }
        }
        return () => {
            Element.prototype.scrollIntoView = original
        }
    }, [])

    return null
}
