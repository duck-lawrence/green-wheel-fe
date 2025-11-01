"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import React from "react"
import { useGetBusinessVariables } from "@/hooks/queries/useBusinessVariables"
export default function NotFound() {
    const router = useRouter()
    const { data: businessVariables } = useGetBusinessVariables()
    console.log("businessVariables", businessVariables)
    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-[#0B0F0C] text-white">
            {/* 🔰 Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F0C] via-[#0F2612] to-[#0B0F0C] opacity-90" />

            {/* 🚘 Car silhouette background */}
            <motion.img
                src="/images/a2.jpg"
                alt="Car silhouette"
                className="absolute  opacity-20  select-none pointer-events-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 0.2, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* 🔢 404 text */}
            <motion.h1
                className="text-[140px] sm:text-[180px] font-extrabold z-10 text-white drop-shadow-[0_0_15px_rgba(0,166,62,0.8)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                404
            </motion.h1>

            {/* 📝 Message */}
            <p className="mt-2 text-gray-300 z-10 text-lg sm:text-xl">
                Oops! Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
            </p>

            {/* 🌿 Button */}
            <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-full shadow-lg z-10 transition-colors"
            >
                🚗 Quay lại Trang chủ
            </motion.button>

            {/* ⚡ Subtle glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 via-lime-400 to-green-600 shadow-[0_0_15px_#00A63E]" />
        </div>
    )
}
