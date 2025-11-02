import { buildTabs, Sidebar, SidebarItem } from "@/components"
import { useGetMe } from "@/hooks"
import React from "react"
import { useTranslation } from "react-i18next"

export function DashboardSidebar({ className }: { className?: string }) {
    const { data: user } = useGetMe()
    const { t } = useTranslation()

    const defaultTabs: SidebarItem[] = []

    const staffTabs: SidebarItem[] = [
        {
            key: "/dashboard/rental-bookings",
            label: t("staff.sidebar_bookings"),
            href: "/dashboard/rental-bookings"
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
            key: "/dashboard/customer-supports",
            label: t("staff.sidebar_customer_supports"),
            href: "/dashboard/customer-supports"
        },
        {
            key: "/dashboard/reports",
            label: t("staff.sidebar_reports"),
            href: "/dashboard/reports"
        },
        {
            key: "/dashboard/feedback",
            label: t("staff.sidebar_feedback"),
            href: "/dashboard/feedback"
        }
    ]

    const adminTabs: SidebarItem[] = [
        {
            key: "/dashboard/statistic",
            label: t("admin.statistic"),
            href: "/dashboard/statistic"
        },
        {
            key: "/dashboard/vehicle-management",
            label: t("admin.sidebar_vehicle_management"),
            href: "/dashboard/vehicle-management"
        },
        {
            key: "/dashboard/vehicle-components",
            label: t("admin.sidebar_vehicle_components"),
            href: "/dashboard/vehicle-components"
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
        },
        {
            key: "/dashboard/customer-supports",
            label: t("staff.sidebar_customer_supports"),
            href: "/dashboard/customer-supports"
        },
        {
            key: "/dashboard/reports",
            label: t("staff.sidebar_reports"),
            href: "/dashboard/reports"
        },
        {
            key: "/dashboard/system-setting",
            label: t("admin.system_setting"),
            href: "/dashboard/system-setting"
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
