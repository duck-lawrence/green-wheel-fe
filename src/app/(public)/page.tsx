"use client"
import {
    Carousel,
    CustomerReview,
    HowToRent,
    HeroSection,
    ScrollToTopButton,
    Stations,
    WhyChoose
} from "@/components"
import React, { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, useSearchParams } from "next/navigation"
import { addToast } from "@heroui/toast"

export default function HomePage() {
    const { t } = useTranslation()
    const router = useRouter()
    const params = useSearchParams()
    const hasShownToast = useRef(false)

    useEffect(() => {
        if (hasShownToast.current) return
        const reason = params.get("reason")
        if (reason === "expired" || reason === "no_token") {
            addToast({
                title: t("toast.error"),
                description: t("login.please_login"),
                color: "danger"
            })
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
        <div className="relative z-10 max-w-screen w-screen">
            <HeroSection />

            <div className="relative z-10">
                <div className="absolute z-0 inset-0 diamond-background mb-[-1.5rem]" />

                {/* HowItWorks + WhyChoose */}
                <section className="bg-gradient-to-b from-green-200/60 via-white/80 py-24">
                    {/* <HowItWorks /> */}
                    <WhyChoose />
                </section>

                {/* Carousel */}
                <section className="bg-gradient-to-b from-green-100/70 via-white/80 to-transparent py-20">
                    <Carousel />
                </section>

                {/* Stations */}
                <section className="bg-gradient-to-b from-green-200/60 via-white/80 to-transparent py-24">
                    <Stations />
                </section>

                {/* Experience + Review */}
                <section className="bg-gradient-to-b from-green-200/60 via-white/80 py-24">
                    <HowToRent />
                </section>

                {/* <CustomerReview /> */}
                <section className="bg-gradient-to-b from-green-200/60 via-white/80 to-transparent py-24">
                    <CustomerReview />
                </section>
            </div>

            <ScrollToTopButton />
        </div>
    )
}
