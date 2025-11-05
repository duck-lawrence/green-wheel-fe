"use client"

import React, { useMemo, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@heroui/react"
import { useSideBarItemStore } from "@/hooks"
import { Menu, X } from "lucide-react"
import { ButtonIconStyled } from "@/components/styled"
import { createPortal } from "react-dom"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { RoleName } from "@/constants/enum"

export type SidebarItem = {
    key: string
    label: string
    href?: string
    onSelect?: () => void | Promise<void>
}

export type SidebarProps = {
    isDashboard?: boolean
    user?: UserProfileViewRes
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
        [RoleName.Customer]: customerTabs,
        [RoleName.Staff]: staffTabs,
        [RoleName.Admin]: adminTabs
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

export function Sidebar({
    isDashboard = false,
    user = undefined,
    tabs,
    selectedKey,
    className = ""
}: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const activeMenuKey = useSideBarItemStore((s) => s.activeMenuKey)
    const setActiveMenuKey = useSideBarItemStore((s) => s.setActiveMenuKey)
    const [isOpen, setIsOpen] = useState(false) // mobile drawer state

    // Cập nhật active tab dựa vào pathname
    useEffect(() => {
        const matchedTab = tabs
            .filter((t) => t.href)
            .sort((a, b) => b.href!.length - a.href!.length)
            .find(
                (t) =>
                    pathname === t.href ||
                    pathname.startsWith(t.href!.endsWith("/") ? t.href! : `${t.href}/`)
            )

        if (matchedTab && matchedTab.key !== activeMenuKey) {
            setActiveMenuKey(matchedTab.key)
        }
    }, [pathname, tabs, activeMenuKey, setActiveMenuKey])

    const activeKey = useMemo(() => {
        if (activeMenuKey) return activeMenuKey
        const candidate = selectedKey ?? pathname
        if (candidate && tabs.some((tab) => tab.key === candidate)) return candidate
        return tabs[0]?.key
    }, [activeMenuKey, selectedKey, pathname, tabs])

    const handleSelection = useCallback(
        async (key: string | number) => {
            const target = tabs.find((tab) => tab.key === String(key))
            if (!target) return
            if (target.onSelect) await target.onSelect()
            if (target.href && target.href !== pathname) router.push(target.href)
            setIsOpen(false) // đóng drawer mobile sau khi chọn
        },
        [tabs, pathname, router]
    )

    return (
        <LayoutGroup id="account-sidebar">
            {/* Nút hamburger chỉ hiển thị ở mobile */}
            <div className="lg:hidden flex gap-2 justify-center items-center">
                <ButtonIconStyled onPress={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </ButtonIconStyled>
                {isDashboard && user?.station && (
                    <span className="font-medium">{user.station.name}</span>
                )}
            </div>

            {/* Sidebar Mobile */}
            {typeof window !== "undefined" &&
                createPortal(
                    <>
                        {isOpen && (
                            <div
                                className="fixed inset-0 bg-black/30 z-[9998] lg:hidden"
                                onClick={() => setIsOpen(false)}
                            />
                        )}

                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: isOpen ? 0 : "-100%" }}
                            transition={{ type: "spring", stiffness: 260, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-fit bg-white shadow-lg z-[9999] flex flex-col lg:hidden"
                        >
                            {tabs.map((item) => {
                                const isActive = activeKey === item.key
                                return (
                                    <motion.button
                                        key={item.key}
                                        onClick={() => handleSelection(item.key)}
                                        className={cn(
                                            "relative w-full overflow-hidden px-3 py-2 text-xl font-medium",
                                            "flex items-center justify-start whitespace-nowrap transition-colors duration-150",
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        {item.label}
                                    </motion.button>
                                )
                            })}
                        </motion.div>
                    </>,
                    document.body
                )}

            {/* Sidebar Desktop */}
            <div className="hidden lg:flex flex-col md:w-auto md:flex-shrink-0">
                <div
                    className={cn(
                        "relative flex w-sm max-w-sm flex-col rounded-2xl bg-white overflow-hidden shadow-lg shadow-slate-200/70",
                        className
                    )}
                >
                    {isDashboard && user?.station && (
                        <div className="px-4 py-1 text-center font-medium text-lg text-white bg-gray-500">
                            {user.station.name}
                        </div>
                    )}
                    {tabs.map((item) => {
                        const isActive = activeKey === item.key
                        return (
                            <motion.button
                                key={item.key}
                                type="button"
                                onClick={() => handleSelection(item.key)}
                                className={cn(
                                    "relative w-full overflow-hidden px-3 py-2 text-xl font-medium",
                                    "flex items-center justify-center whitespace-nowrap transition-colors duration-150"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="account-sidebar-active"
                                        className="absolute inset-0 bg-primary"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <motion.span
                                    className="relative w-full text-center text-large font-medium whitespace-nowrap"
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
