"use client"
import {
    Carousel,
    CustomerReview,
    GreenWheelExperience,
    HeroSection,
    HowItWorks,
    ScrollToTopButton,
    Stations,
    WhyChoose
} from "@/components"
import React, { useEffect, useRef } from "react"
import { slides } from "@/../public/cars"
import { useTranslation } from "react-i18next"
import { useNavbarItemStore } from "@/hooks/singleton/store/useNavbarItemStore"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

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
        <main className="bg-[url('/images/texture-gray.png')] bg-fixed bg-cover">
            {/* Nhịp 1: Hero + Carousel → high contrast */}
            <HeroSection />
            <section className="bg-transparent py-20">
                <Carousel slides={slides} />
            </section>

            {/* Nhịp 2: HowItWorks + WhyChoose → nền sáng nhẹ */}
            <section className="bg-white/70 backdrop-blur-md py-24">
                <HowItWorks />
                <WhyChoose />
            </section>

            {/* Nhịp 3: Stations → nền mờ trong suốt */}
            <section className="bg-gray-50/70 py-24">
                <Stations />
            </section>

            {/* Nhịp 4: Experience + Review → gradient kết thúc */}
            <section className="bg-gradient-to-b from-green-50/80 via-transparent to-transparent py-24">
                <GreenWheelExperience />
                <CustomerReview />
            </section>
            <ScrollToTopButton />
        </main>
    )
}
