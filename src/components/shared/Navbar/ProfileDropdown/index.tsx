"use client"

import React, { useCallback } from "react"
import { DropdownTrigger, DropdownMenu, DropdownItem, User, Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next"
import { DropdownStyled } from "@/components"
import { useGetMe, useLogout, useTokenStore } from "@/hooks"
import Link from "next/link"
import { DEFAULT_AVATAR_URL, ROLE_ADMIN, ROLE_CUSTOMER, ROLE_STAFF } from "@/constants/constants"
import { useRouter } from "next/navigation"

type DropdownLinkItem = {
    key: string
    href?: string
    label: string
    color?: "danger"
}

export const buildItems = ({
    roleName,
    defaultItems,
    customerItems = [],
    staffItems = [],
    adminItems = [],
    bottomItems = []
}: {
    roleName?: string
    defaultItems: DropdownLinkItem[]
    customerItems?: DropdownLinkItem[]
    staffItems?: DropdownLinkItem[]
    adminItems?: DropdownLinkItem[]
    bottomItems?: DropdownLinkItem[]
}) => {
    const roleItemsMap: Record<string, DropdownLinkItem[]> = {
        [ROLE_CUSTOMER]: customerItems,
        [ROLE_STAFF]: staffItems,
        [ROLE_ADMIN]: adminItems
    }
    const combinedItems = [...defaultItems, ...(roleItemsMap[roleName ?? ""] ?? [])]

    const uniqueItems: DropdownLinkItem[] = []
    const seenKeys = new Set<string>()

    for (const tab of combinedItems) {
        if (seenKeys.has(tab.key)) continue
        seenKeys.add(tab.key)
        uniqueItems.push(tab)
    }

    uniqueItems.push(...bottomItems)
    return uniqueItems
}

export function ProfileDropdown() {
    const { t } = useTranslation()
    const router = useRouter()
    const logoutMutation = useLogout({ onSuccess: () => router.replace("/") })
    const isLoggedIn = useTokenStore((s) => !!s.accessToken)

    const {
        data: user,
        isLoading: isGetMeLoading,
        isError: isGetMeError
    } = useGetMe({ enabled: isLoggedIn })

    // const roleDetail = (user as Partial<{ roleDetail?: MaybeRoleDetail }> | null | undefined)
    //     ?.roleDetail

    const defaultItems: DropdownLinkItem[] = [
        {
            key: "staff_profile",
            href: "/profile",
            label: t("user.profile")
        }
    ]

    const bottomItems: DropdownLinkItem[] = [
        { key: "logout", label: t("navbar.logout") as string, color: "danger" }
    ]

    const customerItems: DropdownLinkItem[] = [
        {
            key: "rental_contracts",
            href: "/rental-contracts",
            label: t("user.rental_contracts")
        },
        {
            key: "customer_support",
            href: "/customer-supports",
            label: t("ticket.customer_support")
        }
    ]

    const adminItems: DropdownLinkItem[] = [
        {
            key: "admin_management",
            href: "/dashboard",
            label: t("admin.dropdown_management")
        }
    ]

    const staffItems: DropdownLinkItem[] = [
        {
            key: "staff_management",
            href: "/dashboard",
            label: t("navbar.staff_management")
        }
    ]

    const dropdownItems = buildItems({
        roleName: user?.role?.name,
        defaultItems,
        adminItems,
        staffItems,
        customerItems,
        bottomItems
    })

    const handleLogout = useCallback(async () => {
        await logoutMutation.mutateAsync()
    }, [logoutMutation])

    // handle get me error
    if (isGetMeLoading || isGetMeError) return <Spinner />

    return (
        <div className="gap-4 flex items-center">
            <DropdownStyled
                classNames={{
                    content: "min-w-fit"
                }}
            >
                <DropdownTrigger>
                    <User
                        as="button"
                        avatarProps={{
                            isBordered: true,
                            src: user?.avatarUrl || DEFAULT_AVATAR_URL
                        }}
                        className="transition-transform"
                        name={user?.firstName.trim() || ""}
                        classNames={{
                            name: "text-[16px] font-bold"
                        }}
                    />
                </DropdownTrigger>
                <DropdownMenu className="max-w-fit" variant="flat">
                    {dropdownItems.map((item) =>
                        item.href ? (
                            <DropdownItem
                                key={item.key}
                                as={Link}
                                href={item.href}
                                className="block pr-5"
                            >
                                {item.label}
                            </DropdownItem>
                        ) : (
                            <DropdownItem
                                key={item.key}
                                textValue={item.label}
                                color={item.color}
                                className="block pr-5"
                                onPress={handleLogout}
                            >
                                {item.label}
                            </DropdownItem>
                        )
                    )}
                </DropdownMenu>
            </DropdownStyled>
        </div>
    )
}
