"use client"
import { ButtonStyled, Carousel, Footer, ScrollToTopButton } from "@/components"
import React, { useEffect, useRef } from "react"
import { slides } from "@/../public/cars"
import { useTranslation } from "react-i18next"
import { useNavbarItemStore } from "@/hooks/singleton/store/useNavbarItemStore"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import GreenWheelExperience from "../demo/page"

export default function HomePage() {
    const { t } = useTranslation()
    const setActiveMenuKey = useNavbarItemStore((s) => s.setActiveMenuKey)
    const router = useRouter()
    const params = useSearchParams()
    const hasShownToast = useRef(false)

    useEffect(() => {
        setActiveMenuKey("home")
    }, [setActiveMenuKey])

    useEffect(() => {
        if (hasShownToast.current) return

        const reason = params.get("reason")
        if (reason === "expired" || reason === "no_token") {
            toast.error(t("login.please_login"))
            hasShownToast.current = true
        }

        // tạo URL mới không có param
        const newParams = new URLSearchParams(params.toString())
        newParams.delete("reason")

        router.replace(
            `${window.location.pathname}${newParams.toString() ? "?" + newParams.toString() : ""}`,
            { scroll: false }
        )
    }, [params, t, router])

    return (
        <>
            <div className="min-h-[80vh]">
                <div className="bannerBackground min-h-[80vh] min-w-full flex flex-col items-start justify-center gap-4"></div>
                <div className="font-bold text-2xl ">Green Rides. Brighter Future.</div>
                <div className="text-gray-500">{t("home.description")}</div>
                <ButtonStyled
                    href="/vehicle-rental"
                    className="text-black h-13 transition-all duration-500
                                            hover:bg-primary hover:text-white hover:border-black"
                    variant="bordered"
                >
                    {t("home.view_details")}
                </ButtonStyled>
                {/* Carousel */}
                <Carousel slides={slides} />
            </div>
            <Carousel slides={slides} />
            <GreenWheelExperience />
            <ScrollToTopButton />
            <Footer />
        </>
    )
}
