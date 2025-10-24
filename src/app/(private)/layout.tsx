"use client"

import { SpinnerStyled } from "@/components"
import { useNavbarItemStore, useTokenStore } from "@/hooks"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathName = usePathname()
    const { t } = useTranslation()
    const setActiveMenuKey = useNavbarItemStore((s) => s.setActiveMenuKey)
    const isLogined = useTokenStore((s) => !!s.accessToken)

    useEffect(() => {
        setActiveMenuKey(undefined)
    }, [setActiveMenuKey])

    //Vấn đề là router.replace đang chạy trong UseEffect,
    //  vốn chỉ kích hoạt sau lần render đầu tiên, vì vậy layout vẫn kịp vẽ children
    //Nên nó hiện nội dung một lúc rồi mới chuyển trang
    //Cách khắc phục là không render gì cả nếu chưa login
    //Nhưng vẫn cần useEffect để redirect, vì redirect không thể thực hiện trong quá trình render
    useEffect(() => {
        if (!isLogined && pathName !== "/") {
            toast.dismiss()
            router.replace("/")
            toast.error(t("login.please_login"))
        }
    }, [isLogined, pathName, router, t])
    //Chặn việc render nội dung khi chưa login đúng role

    if (!isLogined && pathName !== "/") {
        return <SpinnerStyled />
    }

    return <>{children}</>
}
