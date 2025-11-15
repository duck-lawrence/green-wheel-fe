"use client"
import { usePathname, useRouter } from "next/navigation"
import { NavigationAdapter } from "nextstepjs"

/**
 * Adapter này tương thích với NextStep.js 2.1.2 + Next.js App Router.
 * Dùng để đồng bộ router.push() và getCurrentPath().
 */
export function useCustomNavigationAdapter(): NavigationAdapter {
    const router = useRouter()
    const pathname = usePathname()

    return {
        getCurrentPath: () => pathname,
        push: (to: string) => router.push(to)
    }
}
