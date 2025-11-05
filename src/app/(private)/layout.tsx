"use client"

import { SpinnerStyled } from "@/components"
import { useTokenStore } from "@/hooks"
import { addToast } from "@heroui/toast"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathName = usePathname()
    const { t } = useTranslation()
    const isLogined = useTokenStore((s) => !!s.accessToken)

    //Vấn đề là router.replace đang chạy trong UseEffect,
    //  vốn chỉ kích hoạt sau lần render đầu tiên, vì vậy layout vẫn kịp vẽ children
    //Nên nó hiện nội dung một lúc rồi mới chuyển trang
    //Cách khắc phục là không render gì cả nếu chưa login
    //Nhưng vẫn cần useEffect để redirect, vì redirect không thể thực hiện trong quá trình render
    useEffect(() => {
        if (!isLogined && pathName !== "/") {
            addToast({
                title: t("toast.error"),
                description: t("login.please_login"),
                color: "danger"
            })
            router.replace("/")
        }
    }, [isLogined, pathName, router, t])
    //Chặn việc render nội dung khi chưa login đúng role

    if (!isLogined && pathName !== "/") {
        return <SpinnerStyled />
    }

    return <>{children}</>
}
