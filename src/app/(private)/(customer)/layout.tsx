"use client"

import { ROLE_CUSTOMER } from "@/constants/constants"
import { useGetMe } from "@/hooks"

import { Spinner } from "@heroui/react"
import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"
import React, { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user } = useGetMe()

    const isCustomer = useMemo(() => {
        return user?.role?.name === ROLE_CUSTOMER
    }, [user])

    useEffect(() => {
        if (!user) return
        if (!isCustomer) {
            addToast({
                title: t("toast.error"),
                description: t("user.unauthorized"),
                color: "danger"
            })

            router.replace("/")
        }
    }, [isCustomer, router, t, user])

    if (!isCustomer) return <Spinner />

    return <>{children}</>
}
