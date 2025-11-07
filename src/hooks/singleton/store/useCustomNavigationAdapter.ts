// customNavigationAdapter.ts
import { useCallback, useEffect, useState } from "react"
import { NavigationAdapter } from "nextstepjs"

export function useCustomNavigationAdapter(): NavigationAdapter {
    const [location, setLocation] = useState(window.location.pathname)

    // Update location when the URL changes
    useEffect(() => {
        const handleLocationChange = () => {
            setLocation(window.location.pathname)
        }

        window.addEventListener("popstate", handleLocationChange)
        return () => {
            window.removeEventListener("popstate", handleLocationChange)
        }
    }, [])

    // Custom navigation function
    const navigate = useCallback((to: string) => {
        window.history.pushState({}, "", to)
        setLocation(to)
    }, [])

    return { navigate, location }
}
