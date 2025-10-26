"use client"

import React, { useMemo, useCallback, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@heroui/react"
import { ROLE_ADMIN, ROLE_CUSTOMER, ROLE_STAFF } from "@/constants/constants"
import { useSideBarItemStore } from "@/hooks"

export type SidebarItem = {
    key: string
    label: string
    href?: string
    onSelect?: () => void | Promise<void>
}

export type SidebarProps = {
    tabs: SidebarItem[]
    selectedKey?: string
    className?: string
}

export const buildTabs = ({
    roleName,
    defaultTabs,
    customerTabs = [],
    staffTabs = [],
    adminTabs = [],
    bottomTabs = []
}: {
    roleName?: string
    defaultTabs: SidebarItem[]
    customerTabs?: SidebarItem[]
    staffTabs?: SidebarItem[]
    adminTabs?: SidebarItem[]
    bottomTabs?: SidebarItem[]
}) => {
    const roleTabsMap: Record<string, SidebarItem[]> = {
        [ROLE_CUSTOMER]: customerTabs,
        [ROLE_STAFF]: staffTabs,
        [ROLE_ADMIN]: adminTabs
    }
    //LỌC TRÙNG CÁC TAB TRONG SIDEBAR
    //HÀM BUILDTABS BAN ĐẦU CHỈ NỐI DEFAULTTABS VỚI CÁC TAB THEO ROLE
    //NAY SỬA LẠI ĐỂ LỌC TRÙNG
    //VD: ROLE_ADMIN CÓ ADMIN TABS LÀ /DASHBOARD, NẾU DEFAULT TABS CŨNG CÓ /DASHBOARD THÌ CHỈ LẤY 1 TAB
    //ROLE_STAFF CÓ STAFF TABS LÀ /DASHBOARD, NẾU DEFAULT TABS CŨNG CÓ /DASHBOARD THÌ CHỈ LẤY 1 TAB
    const combinedTabs = [...defaultTabs, ...(roleTabsMap[roleName ?? ""] ?? []), ...bottomTabs]

    const uniqueTabs: SidebarItem[] = []
    const seenKeys = new Set<string>()
    //LUỒNG HOẠT ĐỘNG:
    // DUYỆT QUA TẤT CẢ CÁC TAB TRONG COMBINEDTABS
    // NẾU CHƯA XUẤT HIỆN TRONG SEENKEYS THÌ THÊM VÀO UNIQUE TABS VÀ ĐÁNH DẤU ĐÃ XUẤT HIỆN
    // NẾU ĐÃ XUẤT HIỆN RỒI THÌ BỎ QUA
    for (const tab of combinedTabs) {
        if (seenKeys.has(tab.key)) continue
        seenKeys.add(tab.key)
        uniqueTabs.push(tab)
    }

    return uniqueTabs
}

export function Sidebar({ tabs, selectedKey, className = "" }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const activeMenuKey = useSideBarItemStore((s) => s.activeMenuKey)
    const setActiveMenuKey = useSideBarItemStore((s) => s.setActiveMenuKey)

    useEffect(() => {
        // Lấy tab có href hợp lệ và khớp chính xác hoặc prefix
        const matchedTab = tabs
            .filter((t) => t.href)
            .sort((a, b) => b.href!.length - a.href!.length)
            .find(
                (t) =>
                    pathname === t.href ||
                    pathname.startsWith(t.href!.endsWith("/") ? t.href! : `${t.href}/`)
            )

        // Nếu tìm thấy tab phù hợp và khác với activeMenuKey thì cập nhật
        if (matchedTab && matchedTab.key !== activeMenuKey) {
            setActiveMenuKey(matchedTab.key)
        }
    }, [pathname, tabs, activeMenuKey, setActiveMenuKey])

    const activeKey = useMemo(() => {
        if (activeMenuKey) return activeMenuKey
        const candidate = selectedKey ?? pathname
        if (candidate && tabs.some((tab) => tab.key === candidate)) {
            return candidate
        }
        return tabs[0]?.key
    }, [activeMenuKey, selectedKey, pathname, tabs])

    const handleSelection = useCallback(
        async (key: string | number) => {
            const stringKey = String(key)
            const target = tabs.find((tab) => tab.key === stringKey)
            if (!target) return

            if (target.onSelect) {
                await target.onSelect()
                return
            }

            if (target.href && target.href !== pathname) {
                router.push(target.href)
            }
        },
        [tabs, pathname, router]
    )

    return (
        <LayoutGroup id="account-sidebar">
            <div className="flex w-full flex-col md:w-auto md:flex-shrink-0">
                <div
                    className={cn(
                        "relative flex w-full flex-col gap-2 rounded-2xl bg-white p-3 shadow-lg shadow-slate-200/70 md:min-w-3xs",
                        className
                    )}
                >
                    {tabs.map((item) => {
                        const isActive = activeKey === item.key
                        return (
                            <motion.button
                                key={item.key}
                                type="button"
                                onClick={() => {
                                    void handleSelection(item.key)
                                }}
                                className={cn(
                                    "relative w-full overflow-hidden rounded-xl px-4 py-3 text-xl font-medium",
                                    "flex items-center justify-center whitespace-nowrap transition-colors duration-150"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="account-sidebar-active"
                                        className="absolute inset-0 rounded-xl bg-primary"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <motion.span
                                    className="relative w-full text-center text-xl font-medium whitespace-nowrap"
                                    animate={{
                                        color: isActive ? "#ffffff" : "#475569",
                                        scale: isActive ? 1 : 0.98
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                >
                                    {item.label}
                                </motion.span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </LayoutGroup>
    )
}
