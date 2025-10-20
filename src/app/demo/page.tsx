// components/ui/EnergySpark.tsx
"use client"
import { motion } from "framer-motion"
import React from "react"
export default function EnergySpark({ direction = "horizontal" }) {
    const baseClass =
        direction === "horizontal"
            ? "w-32 h-[3px] bg-gradient-to-r from-primary via-teal-400 to-green-400"
            : "h-32 w-[3px] bg-gradient-to-b from-primary via-teal-400 to-green-400"

    return (
        <motion.div
            className={`${baseClass} bg-[length:200%] animate-[flow_3s_linear_infinite] rounded-full opacity-70 mx-auto my-6`}
            style={{
                filter: "drop-shadow(0 0 6px rgba(20,184,166,0.5))"
            }}
        />
    )
}
