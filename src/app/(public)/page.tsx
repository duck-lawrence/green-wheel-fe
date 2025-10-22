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
        <>
            {/* HERO SECTION */}

            <HeroSection />
            {/* CAROUSEL */}
            <section className="max-w-screen-xl mx-auto py-16 px-4">
                <Carousel slides={slides} />
            </section>

            {/* CONTENT SECTIONS */}
            <div>
                <HowItWorks />
            </div>

            <div>
                <WhyChoose />
            </div>

            <div>
                <Stations />
            </div>

            <div>
                <GreenWheelExperience />
            </div>

            {/* REVIEWS */}
            <CustomerReview />

            <ScrollToTopButton />
        </>
    )
}
