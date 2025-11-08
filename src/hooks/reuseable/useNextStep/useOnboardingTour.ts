"use client"
import { useEffect } from "react"
import { useNextStep } from "nextstepjs"
import { usePathname } from "next/navigation"

export const useOnboardingTour = (tourName: string, targetPath: string) => {
    const { startNextStep } = useNextStep()
    const pathname = usePathname()

    // const { data: me } = useGetMe()
    // const newUser = me?.isNewUser
    const newUser = true

    // Reset tour mỗi lần reload nếu autoReset = true
    useEffect(() => {
        if (newUser) {
            localStorage.removeItem("hasSeenOnboarding")
        }
    }, [newUser])

    // Tự động hiển thị tour khi vào đúng route
    useEffect(() => {
        if (pathname === targetPath && !localStorage.getItem("hasSeenOnboarding")) {
            const timeout = setTimeout(() => {
                startNextStep(tourName)
                localStorage.setItem("hasSeenOnboarding", "true")
            }, 800) // delay để UI ổn định
            return () => clearTimeout(timeout)
        }
    }, [pathname, targetPath, startNextStep, tourName])
}
