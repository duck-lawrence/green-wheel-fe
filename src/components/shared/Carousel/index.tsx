"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { ImageStyled } from "@/components/styled"
import { GREENWHEEL } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import { useGetAllVehicleModelImages } from "@/hooks"
import { slides as defaultSlides } from "@/../public/cars"

export const Carousel = () => {
    const { t } = useTranslation()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [slidesPerView, setSlidesPerView] = useState(1)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const startX = useRef<number | null>(null)
    const sectionRef = useRef<HTMLDivElement>(null)

    const { data } = useGetAllVehicleModelImages()

    const slides = useMemo(() => {
        if (!data || data.length === 0) return defaultSlides
        return data.map((item) => item.imageUrl)
    }, [data])

    // Observer: fade in khi vào viewport
    useEffect(() => {
        const node = sectionRef.current
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => setIsVisible(entry.isIntersecting)),
            { threshold: 0.2 }
        )

        if (node) observer.observe(node)

        return () => {
            if (node) observer.unobserve(node)
        }
    }, [])

    // Responsive slides per view
    useEffect(() => {
        const updateSlidesPerView = () => setSlidesPerView(window.innerWidth >= 1024 ? 3 : 1)
        updateSlidesPerView()
        window.addEventListener("resize", updateSlidesPerView)
        return () => window.removeEventListener("resize", updateSlidesPerView)
    }, [])

    // Clone slides
    const extendedSlides = useMemo(() => {
        const headClones = slides.slice(0, slidesPerView)
        const tailClones = slides.slice(-slidesPerView)
        return [...tailClones, ...slides, ...headClones]
    }, [slides, slidesPerView])

    useEffect(() => {
        setCurrentIndex(slidesPerView)
    }, [slidesPerView, slides])

    // Slide logic
    const nextSlide = () => {
        setCurrentIndex((prev) => prev + 1)
        setIsTransitioning(true)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => prev - 1)
        setIsTransitioning(true)
    }

    const goToSlide = (index: number) => {
        const targetIndex = index + slidesPerView
        if (targetIndex === currentIndex) return

        if (currentIndex >= slides.length + slidesPerView - 1 && index === 0) {
            setIsTransitioning(true)
            setCurrentIndex(slides.length + slidesPerView)
            return
        }

        if (currentIndex === slidesPerView && index === slides.length - 1) {
            setIsTransitioning(true)
            setCurrentIndex(slidesPerView - 1)
            return
        }

        setIsTransitioning(true)
        setCurrentIndex(targetIndex)
    }

    const handleTransitionEnd = () => {
        if (currentIndex >= slides.length + slidesPerView) {
            setIsTransitioning(false)
            setCurrentIndex(slidesPerView)
        }
        if (currentIndex < slidesPerView) {
            setIsTransitioning(false)
            setCurrentIndex(slides.length + slidesPerView - 1)
        }
    }

    const handleTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX)
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX.current !== null) {
            const endX = e.changedTouches[0].clientX
            const diff = startX.current - endX
            if (diff > 50) nextSlide()
            if (diff < -50) prevSlide()
        }
        startX.current = null
    }

    const getCenterIndex = () => {
        if (slidesPerView === 1) return currentIndex
        if (slidesPerView === 3) return (currentIndex + 1) % extendedSlides.length
        return currentIndex
    }

    const centerIndex = getCenterIndex()

    return (
        <div
            ref={sectionRef}
            className={`relative flex flex-col items-center justify-center py-24 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
            <style>{`
                @keyframes flow {
                    0% { background-position: 0 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes sparkMove {
                    0% { left: 0%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
            `}</style>

            {/* Title */}
            <div className="text-center mb-16 relative">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                    {t("home.our_fleet_at")} <span className="text-teal-500">{GREENWHEEL}</span>
                </h2>

                {/* Energy spark line dưới title */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-40 h-[4px]
                               bg-gradient-to-r from-primary via-teal-400 to-green-400
                               bg-[length:200%] animate-[flow_3s_linear_infinite]
                               rounded-full opacity-70 overflow-hidden"
                >
                    <span
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                                   bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                        style={{ animation: "sparkMove 2.5s linear infinite" }}
                    ></span>
                </div>
            </div>

            {/* Dòng năng lượng phía trên carousel */}
            <div
                className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[70%] h-[4px]
                           bg-gradient-to-r from-primary via-teal-400 to-green-400
                           bg-[length:200%] animate-[flow_3s_linear_infinite]
                           rounded-full opacity-40 overflow-hidden"
            >
                <span
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                               bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                    style={{ animation: "sparkMove 2.8s linear infinite" }}
                ></span>
            </div>

            {/* Carousel */}
            <div className="relative w-full mt-10">
                <div
                    className="overflow-hidden relative h-80"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={`flex h-full ${
                            isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
                        }`}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedSlides.map((src, i) => {
                            const isCenter = i === centerIndex
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center justify-center p-6 transition-transform duration-500 ${
                                        isCenter ? "scale-110 z-10" : "scale-90 opacity-70"
                                    } overflow-hidden rounded-xl`}
                                    style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                                >
                                    <div className="relative overflow-hidden bg-white rounded-xl shadow-lg w-fit h-fit">
                                        <ImageStyled src={src} alt="" width={460} height={350} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Overlay điều khiển */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-20 bg-transparent"
                    />
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-20 bg-transparent"
                    />
                </div>

                {/* Dots */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentIndex - slidesPerView === i ? "bg-primary" : "bg-gray-400"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
