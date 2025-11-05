"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useGetMe } from "@/hooks"
import { addToast } from "@heroui/toast"
import { SpinnerStyled } from "@/components"
import { RoleName } from "@/constants/enum"

export default function DashboardPage() {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe({ enabled: true })

    const roleName = user?.role?.name
    const isSuperAdmin = roleName === RoleName.SuperAdmin
    const isAdmin = roleName === RoleName.Admin
    const isStaff = roleName === RoleName.Staff

    useEffect(() => {
        if (isLoading) return
        if (isError || (!isSuperAdmin && !isAdmin && !isStaff)) {
            addToast({
                title: t("toast.error"),
                description: t("user.unauthorized"),
                color: "danger"
            })

            router.replace("/")
        }
        if (isAdmin) router.replace("/dashboard/statistic")
        if (isStaff) router.replace("/dashboard/rental-bookings")
    }, [isAdmin, isStaff, isError, isLoading, router, t, isSuperAdmin])

    return <SpinnerStyled />
}
