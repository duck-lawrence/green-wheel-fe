"use client"

import { buildTabs, Sidebar, SidebarItem } from "@/components/"
import { useGetMe } from "@/hooks"
import React from "react"
import { useTranslation } from "react-i18next"

export function ProfileSidebar({ className }: { className?: string }) {
    const { data: user } = useGetMe()
    const { t } = useTranslation()

    const defaultTabs: SidebarItem[] = [
        { key: "/profile", label: t("user.my_profile"), href: "/profile" },
        {
            key: "/profile/change-password",
            label: user?.needSetPassword ? t("auth.set_password") : t("auth.change_password"),
            href: "/profile/change-password"
        }
    ]

    const customerTabs: SidebarItem[] = [
        // {
        //     key: "/profile/rental-contracts",
        //     label: t("user.rental_contracts"),
        //     href: "/profile/rental-contracts"
        // }
    ]

    const staffTabs: SidebarItem[] = []

    const tabs = buildTabs({
        roleName: user?.role?.name,
        defaultTabs,
        customerTabs,
        staffTabs
    })

    return <Sidebar tabs={tabs} className={className} />
}
