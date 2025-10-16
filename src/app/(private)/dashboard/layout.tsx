"use client"

import { DashboardSidebar } from "@/components/shared/SidebarGroup/DashboardSidebar"

import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full max-w-7xl flex-col gap-6 md:flex-row">
            <DashboardSidebar className="w-40" />
            <div className="flex-1">{children}</div>
        </div>
    )
}
