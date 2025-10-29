import { ProfileSidebar } from "@/components/shared/SidebarGroup/ProfileSidebar"
import React from "react"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full max-w-full flex-col gap-3 lg:gap-6 lg:max-w-7xl lg:flex-row">
            <ProfileSidebar className="w-64" />
            <div className="w-full overflow-y-auto px-4 sm:px-14 py-6 shadow-2xs rounded-2xl bg-white">
                {children}
            </div>
        </div>
    )
}
