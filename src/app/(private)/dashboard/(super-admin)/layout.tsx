"use client"

import { RoleName } from "@/constants/enum"
import { useGetMe } from "@/hooks"
import { Spinner } from "@heroui/react"
import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe({ enabled: true })

    const isSuperAdmin = user?.role?.name === RoleName.SuperAdmin

    useEffect(() => {
        if (isLoading) return

        if (isError || !isSuperAdmin) {
            addToast({
                title: t("toast.error"),
                description: t("user.unauthorized"),
                color: "danger"
            })

            router.replace("/")
        }
    }, [isSuperAdmin, isError, isLoading, router, t])

    if (!isSuperAdmin) return <Spinner />

    return <>{children}</>
}
