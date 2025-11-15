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
import React from "react"
import { useOnboardingTour } from "@/hooks"

export default function HomePage() {
    // Tour onboarding cho trang chủ
    useOnboardingTour("greenwheel", "/")

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
