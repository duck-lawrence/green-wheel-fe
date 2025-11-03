import { useRouter } from "next/navigation"
import React from "react"

export const useNavigateOnClick = () => {
    const router = useRouter()

    return (url: string) => (e: React.MouseEvent) => {
        // Middle click hoặc Ctrl/Command click -> mở tab mới
        if (e.button === 1 || e.ctrlKey || e.metaKey) {
            window.open(url, "_blank")
        } else if (e.button === 0) {
            router.push(url)
        }
    }
}
