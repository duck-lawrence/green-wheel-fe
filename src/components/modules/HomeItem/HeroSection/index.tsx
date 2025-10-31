"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ButtonStyled } from "@/components"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useTypewriter } from "@/hooks"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

const images = [
    { src: "/images/home-banner/3.png", direction: "right" },
    { src: "/images/home-banner/2.png", direction: "right" },
    { src: "/images/home-banner/1.png", direction: "right" },
    { src: "/images/home-banner/green.png", direction: "bottom" },
    { src: "/images/home-banner/car.png", direction: "right" }
]

export function HeroSection() {
    const { t } = useTranslation()

    const slogans = [
        "Drive Electric\nGo Green",
        "Rent Smarter\nSave More",
        "Green Wheel\nThe Future is Electric"
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
                relative w-full h-auto min-h-screen mt-[-6.25rem]
                flex items-center justify-start
                overflow-hidden text-white 
                px-4 sm:px-6 md:px-12 lg:px-20
            "
        >
            {/* Background image */}
            {images.map((img, index) => {
                // delay: ảnh green xuất hiện cùng lúc ảnh 3 (index 0)
                const delay = img.src.includes("green") ? 0 : index * 0.3

                // hướng trượt
                const initial =
                    img.direction === "bottom" ? { y: 200, opacity: 0 } : { x: 200, opacity: 0 }

                return (
                    <motion.div
                        key={img.src}
                        initial={initial}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.6,
                            delay,
                            ease: "easeInOut"
                        }}
                        className={clsx(
                            "absolute inset-0",
                            !img.src.includes("green") && "hidden md:block"
                        )}
                    >
                        <Image
                            src={img.src}
                            alt="Green Wheel"
                            fill
                            className="object-cover object-center"
                            priority={img.src.includes("green") || index === 0}
                        />
                    </motion.div>
                )
            })}

            {/* Overlay gradient (different levels for breakpoints) */}
            {/* <div
                className="
                    lg:hidden absolute inset-0 
                    bg-gradient-to-b 
                    from-black/40 via-black/25 to-black/35
                "
            /> */}
            <div
                className="
                    lg:hidden absolute inset-0
                    backdrop-blur-md
                    bg-gradient-to-b 
                    from-white/40 via-white/25 to-white/35
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
                    z-10 flex flex-col
                    text-center ml:top-10 ms:mr-0 md:text-left
                    max-w-[38rem] min-w-[38erm]
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
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="
                            font-bold leading-tight 
                            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                            text-primary min-h-[10rem]
                            whitespace-pre-line
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
                        text-black sm:text-lg md:text-xl
                        leading-relaxed
                        min-w-full md:max-w-[90%]
                        mx-auto md:mx-0
                        whitespace-pre-line
                    "
                >
                    {t("home.desc_first")}{" "}
                    <span className="text-teal-500 font-medium">{t("home.desc_second")}</span>
                    {` ${t("home.desc_third")}`}
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
                        as={Link}
                        className="
                            text-base md:text-lg font-semibold px-8 py-3 rounded-xl 
                            btn-gradient btn-gradient:hover btn-gradient:active
                            transition-all duration-400 shadow-lg hover:shadow-teal-500/30 
                            text-center w-full sm:w-auto
                        "
                    >
                        {t("home.vehicle_rental")}
                    </ButtonStyled>

                    <ButtonStyled
                        href="/about"
                        as={Link}
                        variant="bordered"
                        className="
                            md:text-lg font-semibold px-8 py-3 rounded-xl 
                            border-2 transition-all duration-400 
                            w-full sm:w-auto text-center
                            text-gray-800 border-gray-800
                            hover:text-secondary hover:bg-gray-800
                        "
                    >
                        {t("home.about")}
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
