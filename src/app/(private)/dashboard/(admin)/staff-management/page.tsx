"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { UserSwitch } from "@phosphor-icons/react"

function StaffManagement() {
    const { t } = useTranslation()

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-8 space-y-6">
            <div className="flex items-center gap-3 px-4">
                <UserSwitch
                    size={36}
                    weight="duotone"
                    className="text-primary"
                    aria-hidden="true"
                />
                <h1 className="text-3xl font-bold text-gray-900">
                    {t("admin.staff_management_title")}
                </h1>
            </div>
            <p className="px-4 text-sm text-slate-500">
                {t("admin.staff_management_description")}
            </p>
            <div className="mx-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                <p className="text-sm text-slate-500">
                    {t("admin.staff_management_placeholder")}
                </p>
            </div>
        </div>
    )
}

export default function StaffManagementPage() {
    return <StaffManagement />
}
