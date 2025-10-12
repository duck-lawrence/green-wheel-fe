"use client"

import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Spinner } from "@heroui/react"

import { ROLE_ADMIN, ROLE_STAFF } from "@/constants/constants"
import { useGetMe } from "@/hooks"
import { StaffUserManagementContent } from "../(staff)/user-management/StaffUserManagementContent"
import { AdminUserManagementContent } from "../(admin)/user-management/AdminUserManagementContent"

export default function DashboardUserManagementPage() {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe({ enabled: true })

    const roleName = user?.role?.name
    const isStaff = roleName === ROLE_STAFF
    const isAdmin = roleName === ROLE_ADMIN

    useEffect(() => {
        if (isLoading) return
        if (isError || (!isStaff && !isAdmin)) {
            toast.dismiss()
            toast.error(t("user.unauthorized"))
            router.replace("/")
        }
    }, [isAdmin, isError, isLoading, isStaff, router, t])

    if (isLoading) {
        return (
            <div className="flex w-full justify-center py-10">
                <Spinner />
            </div>
        )
    }

    if (!isStaff && !isAdmin) {
        return null
    }

    if (isAdmin) {
        return <AdminUserManagementContent />
    }

    return <StaffUserManagementContent />
}
