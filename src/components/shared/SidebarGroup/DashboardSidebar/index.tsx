import { buildTabs, Sidebar, SidebarItem } from "@/components"
import { useGetMe } from "@/hooks"
import React from "react"
import { useTranslation } from "react-i18next"

export function DashboardSidebar({ className }: { className?: string }) {
    const { data: user } = useGetMe()
    const { t } = useTranslation()

    const defaultTabs: SidebarItem[] = [
        { key: "/dashboard", label: t("staff.sidebar_dashboard"), href: "/dashboard" }
    ]

    const staffTabs: SidebarItem[] = [
        {
            key: "/dashboard/rental-contracts",
            label: t("staff.sidebar_contracts"),
            href: "/dashboard/rental-contracts"
        },
        {
            key: "/dashboard/vehicle-checklists",
            label: t("staff.sidebar_vehicle_checklists"),
            href: "/dashboard/vehicle-checklists"
        },
        {
            key: "/dashboard/user-management",
            label: t("staff.sidebar_user_management"),
            href: "/dashboard/user-management"
        },

        {
            key: "/dashboard/reports",
            label: t("staff.sidebar_reports"),
            href: "/dashboard/reports"
        }
        // {
        //     key: "/dashboard/test",
        //     label: t("staff.sidebar_test"),
        //     href: "/dashboard/test"
        // }
    ]

    const adminTabs: SidebarItem[] = [
        {
            key: "/dashboard",
            label: t("staff.sidebar_dashboard"),
            href: "/dashboard"
        },
        {
            key: "/dashboard/vehicle-management",
            label: t("admin.sidebar_vehicle_management", "Vehicle management"),
            href: "/dashboard/vehicle-management"
        },
        {
            key: "/dashboard/staff-management",
            label: t("admin.sidebar_staff_management"),
            href: "/dashboard/staff-management"
        },
        {
            key: "/dashboard/dispatch",
            label: t("admin.dispatch"),
            href: "/dashboard/dispatch"
        },
        {
            key: "/dashboard/fleet",
            label: t("admin.sidebar_fleet", "Fleet"),
            href: "/dashboard/fleet"
        }
    ]

    const tabs = buildTabs({
        roleName: user?.role?.name,
        defaultTabs,
        staffTabs,
        adminTabs
    })

    return <Sidebar tabs={tabs} className={className} />
}
