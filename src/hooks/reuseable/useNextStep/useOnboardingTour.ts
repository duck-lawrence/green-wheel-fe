"use client"
import { useEffect } from "react"
import { useNextStep } from "nextstepjs"
import { usePathname } from "next/navigation"
import { useGetMe } from "@/hooks/queries"
import { RoleName } from "@/constants/enum"

export const useOnboardingTour = (tourName: string, targetPath: string) => {
    const { startNextStep } = useNextStep()
    const pathname = usePathname()

    const { data: me } = useGetMe()

    // Reset nếu me?.hasSeenTutorial === false
    useEffect(() => {
        if (me?.role?.name == RoleName.Customer && me?.hasSeenTutorial === false) {
            localStorage.removeItem("hasSeenOnboarding")
        }
    }, [me?.hasSeenTutorial, me?.role?.name])

    // auto start tour
    useEffect(() => {
        if (
            pathname === targetPath &&
            me?.role?.name == RoleName.Customer &&
            me?.hasSeenTutorial === false &&
            !localStorage.getItem("hasSeenOnboarding")
        ) {
            const timeout = setTimeout(() => {
                startNextStep(tourName)
                localStorage.setItem("hasSeenOnboarding", "true")
            }, 800)
            return () => clearTimeout(timeout)
        }
    }, [pathname, targetPath, startNextStep, tourName, me?.role?.name, me?.hasSeenTutorial])
}
