"use client"
import { useEffect } from "react"

/**
 * Dùng để auto mở dropdown user khi NextStep tới bước 2
 * và đợi cho tới khi phần tử "navbar-profile" render ra trước khi NextStep render step kế tiếp
 */
export function useTourSync() {
    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        const shouldOpen = search.get("openUserMenu") === "1"
        if (!shouldOpen) return

        // Tìm avatar
        const avatar = document.getElementById("navbar-user")
        if (!avatar) return

        // 1️⃣ Click để mở dropdown
        setTimeout(() => {
            avatar.click()

            // 2️⃣ Đợi element profile xuất hiện thật sự
            const checkInterval = setInterval(() => {
                const profileItem = document.getElementById("navbar-profile")
                if (profileItem) {
                    // Khi phần tử xuất hiện → highlight an toàn
                    clearInterval(checkInterval)
                    // Cuộn cho chắc chắn phần tử nằm trong viewport
                    profileItem.scrollIntoView({ behavior: "smooth", block: "center" })
                    // 3️⃣ Đánh dấu là “ready”
                    document.body.setAttribute("data-tour-profile-ready", "true")
                }
            }, 100)
        }, 150)

        // Xóa query param sau khi xử lý
        search.delete("openUserMenu")
        const newUrl = `${window.location.pathname}${search.toString() ? `?${search}` : ""}`
        window.history.replaceState({}, "", newUrl)
    }, [])
}
