"use client"

import { DashboardSidebar } from "@/components/shared/SidebarGroup/DashboardSidebar"

import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full max-w-screen lg:max-w-7xl flex-col gap-6 lg:flex-row">
            <DashboardSidebar className="min-w-fit w-40" />
            <div className="w-full">{children}</div>
        </div>
    )
}
