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
import { useRouter, useSearchParams } from "next/navigation"
import { useGetAllStations } from "@/hooks"
import { addToast } from "@heroui/toast"

export default function HomePage() {
    const { t } = useTranslation()
    const router = useRouter()
    const params = useSearchParams()
    const hasShownToast = useRef(false)
    const { data: station } = useGetAllStations()

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
        <div className="relative z-10">
            <HeroSection />

            {/* Carousel */}
            <section className="bg-gradient-to-b from-green-100/70 via-white/80 to-transparent py-20">
                <Carousel slides={slides} />
            </section>

            {/* HowItWorks + WhyChoose */}
            <section className="bg-white/70 backdrop-blur-md border-y border-green-100 py-24">
                <HowItWorks />
                <WhyChoose />
            </section>

            {/* Stations */}
            <section className="bg-gradient-to-b from-green-100/70 via-white/80 to-transparent py-24">
                <Stations stations={station === undefined ? [] : station} />
            </section>

            {/* Experience + Review */}
            <section className="bg-white/70 backdrop-blur-md border-y border-green-100 py-24">
                <GreenWheelExperience />
            </section>

            {/* <CustomerReview /> */}
            <section className="bg-gradient-to-b from-green-100/70 via-white/80 to-transparent py-24">
                <CustomerReview />
            </section>

            <ScrollToTopButton />
        </div>
    )
}
