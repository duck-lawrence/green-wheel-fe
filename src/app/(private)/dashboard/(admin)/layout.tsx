"use client"

import { ROLE_ADMIN, ROLE_STAFF } from "@/constants/constants"
import { useGetMe } from "@/hooks"
import { Spinner } from "@heroui/react"
import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe({ enabled: true })

    const roleName = user?.role?.name
    const isAdmin = roleName === ROLE_ADMIN
    const isStaff = roleName === ROLE_STAFF

    useEffect(() => {
        if (isLoading) return

        if (isStaff) {
            router.replace("/dashboard/users")
            return
        }

        if (isError || !isAdmin) {
            addToast({
                title: t("toast.error"),
                description: t("user.unauthorized"),
                color: "danger"
            })

            router.replace("/")
        }
    }, [isAdmin, isError, isLoading, isStaff, router, t])

    if (isLoading) return <Spinner />

    if (!isAdmin) return null

    return <>{children}</>
}
