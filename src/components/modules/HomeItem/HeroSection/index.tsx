"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ButtonStyled } from "@/components"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useTypewriter } from "@/utils/helpers/useTypewriter"
import Image from "next/image"

export function HeroSection() {
    const { t } = useTranslation()

    const slogans = [
        "Drive Electric. Go Green.",
        "Rent Smarter. Save More.",
        "Green Wheel – The Future is Electric."
    ]

    const [index, setIndex] = useState(0)
    const [text, done] = useTypewriter(slogans[index], 80, 300)

    useEffect(() => {
        if (done) {
            const timeout = setTimeout(() => {
                setIndex((prev) => (prev + 1) % slogans.length)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [done, slogans.length])

    return (
        <section
            className="
                relative w-full h-auto min-h-[70vh] mt-10
                flex items-center justify-center
                overflow-hidden text-white 
                px-4 sm:px-6 md:px-12 lg:px-24
            "
        >
            {/* Background image */}
            <Image
                src="/images/test-bg2.png"
                alt="Green Wheel"
                fill
                className="object-cover object-center opacity-100"
                priority
            />

            {/* Overlay gradient (different levels for breakpoints) */}
            <div
                className="
                    absolute inset-0 
                    bg-gradient-to-b 
                    from-black/20 via-black/10 to-black/20
                    md:from-black/40 md:via-black/25 md:to-black/35
                "
            />

            {/* Dynamic light */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="
                    absolute inset-0 
                    bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.25),transparent_70%)]
                "
            />

            {/* Content */}
            <div
                className="
                    relative z-10 flex flex-col justify-center
                    text-center ml:top-10  ms:mr-0 md:text-left
                    max-w-[700px] sm:max-w-[600px]
                    space-y-6 py-10 md:py-0
                "
            >
                {/* Slogan typing animation */}
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="
                            font-bold leading-tight 
                            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                            text-balance
                        "
                    >
                        {text}
                        <span className="animate-pulse">|</span>
                    </motion.h1>
                </AnimatePresence>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="
                        text-base sm:text-lg md:text-xl
                        text-gray-100/90 leading-relaxed
                        max-w-full md:max-w-[90%]
                        mx-auto md:mx-0
                    "
                >
                    Thuê xe điện thông minh, tiết kiệm và thân thiện môi trường. Trải nghiệm hành
                    trình{" "}
                    <span className="text-teal-400 font-medium">xanh – an toàn – bền vững</span>.
                </motion.p>

                {/* Energy bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "140px" }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="
                        h-[4px] mx-auto md:mx-0
                        bg-gradient-to-r from-primary via-teal-400 to-green-400
                        rounded-full shadow-[0_0_12px_#10b981]
                    "
                />

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="
                        flex flex-col sm:flex-row gap-4 
                        mt-6 justify-center md:justify-start
                    "
                >
                    <ButtonStyled
                        href="/vehicle-rental"
                        className="
                            text-base md:text-lg font-semibold px-8 py-3 rounded-xl 
                            btn-gradient btn-gradient:hover btn-gradient:active
                            transition-all duration-400 shadow-lg hover:shadow-teal-500/30 
                            text-center w-full sm:w-auto
                        "
                    >
                        {t("home.view_details")}
                    </ButtonStyled>

                    <ButtonStyled
                        href="/about"
                        className="
                            text-base md:text-lg font-semibold px-8 py-3 rounded-xl 
                            border-2 border-white text-white 
                            hover:bg-white hover:text-primary transition-all duration-400 
                            w-full sm:w-auto text-center
                        "
                        variant="bordered"
                    >
                        {t("home.learn_more")}
                    </ButtonStyled>
                </motion.div>
            </div>

            {/* Floating spark */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="
                    absolute bottom-6 sm:bottom-10 md:bottom-20 
                    right-[15%] sm:right-[20%] md:right-[25%]
                    w-3 h-3 bg-teal-400 rounded-full 
                    shadow-[0_0_10px_4px_rgba(20,184,166,0.6)]
                "
            />
        </section>
    )
}
