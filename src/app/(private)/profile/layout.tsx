import { ProfileSidebar } from "@/components/shared/SidebarGroup/ProfileSidebar"
import React from "react"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full max-w-full flex-col gap-1 lg:gap-6 lg:max-w-7xl lg:flex-row">
            <aside className="self-start sticky bottom-10">
                <ProfileSidebar className="min-w-fit w-40 text-sm" />
            </aside>
            <div className="w-full">{children}</div>
        </div>
    )
}
