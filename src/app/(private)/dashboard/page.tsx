"use client"

import React, { useEffect } from "react"
import { Spinner } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { ROLE_ADMIN, ROLE_STAFF } from "@/constants/constants"
import { useGetMe } from "@/hooks"
import { addToast } from "@heroui/toast"
import { SpinnerStyled } from "@/components"

export default function DashboardPage() {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe({ enabled: true })

    const roleName = user?.role?.name
    const isAdmin = roleName === ROLE_ADMIN
    const isStaff = roleName === ROLE_STAFF

    useEffect(() => {
        if (isLoading) return
        if (isError || (!isAdmin && !isStaff)) {
            addToast({
                title: t("toast.error"),
                description: t("user.unauthorized"),
                color: "danger"
            })

            router.replace("/")
        }
        if (isAdmin) router.replace("/dashboard")
        if (isStaff) router.replace("/dashboard/rental-bookings")
    }, [isAdmin, isStaff, isError, isLoading, router, t])

    if (isLoading) {
        return (
            <div className="flex w-full justify-center py-10">
                <Spinner />
            </div>
        )
    }

    if (!isAdmin && !isStaff) {
        return null
    }

    return <SpinnerStyled />
}
