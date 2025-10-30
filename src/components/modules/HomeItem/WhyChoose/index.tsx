"use client"
import { GREENWHEEL } from "@/constants/constants"
import { motion } from "framer-motion"
import { Leaf, Zap, FileCheck, Shield } from "lucide-react"
import React from "react"
import { useTranslation } from "react-i18next"

export function WhyChoose() {
    const { t } = useTranslation()

    const reasons = [
        {
            icon: <Zap />,
            title: t("home.reason_electric"),
            desc: t("home.reason_electric_desc")
        },
        {
            icon: <FileCheck />,
            title: t("home.reason_smart"),
            desc: t("home.reason_smart_desc")
        },
        {
            icon: <Shield />,
            title: t("home.reason_safe"),
            desc: t("home.reason_safe_desc")
        },
        {
            icon: <Leaf />,
            title: t("home.reason_green"),
            desc: t("home.reason_green_desc")
        }
    ]

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-24 text-center bg-transparent overflow-hidden relative"
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

            {/* Header */}
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-12 text-primary relative inline-block"
            >
                {t("home.why_choose")} <span className="text-teal-500">{GREENWHEEL}?</span>
                {/* Dòng năng lượng dưới tiêu đề */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-40 h-[4px]
                               bg-gradient-to-r from-primary via-teal-400 to-green-400
                               bg-[length:200%] animate-[flow_3s_linear_infinite]
                               rounded-full opacity-70 overflow-hidden"
                >
                    {/* Spark chạy qua */}
                    <span
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                                   bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                        style={{
                            animation: "sparkMove 2.5s linear infinite"
                        }}
                    ></span>
                </div>
            </motion.h2>

            {/* Grid + energy line */}
            <div className="relative max-w-7xl mx-auto px-6">
                {/* Dòng năng lượng ngang nối 4 card */}
                <div
                    className="hidden md:block absolute left-1/2 top-[52%] -translate-x-1/2 
                               w-[80%] h-[5px] rounded-full 
                               bg-gradient-to-r from-primary via-teal-400 to-green-400 
                               bg-[length:200%] animate-[flow_3s_linear_infinite] opacity-50"
                />
                {/* Spark di chuyển ngang */}
                <div className="hidden md:block absolute left-[10%] top-[52%] w-[80%] h-[5px] overflow-visible">
                    <span
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full 
                                   bg-white shadow-[0_0_12px_4px_rgba(20,184,166,0.8)]"
                        style={{
                            animation: "sparkMove 2.8s linear infinite"
                        }}
                    ></span>
                </div>

                {/* Lý do */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {reasons.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.3 }}
                            whileHover={{
                                scale: 1.05,
                                y: -6,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            whileTap={{
                                scale: 1.02,
                                transition: { duration: 0.1 }
                            }}
                            animate={{
                                scale: 1,
                                y: 0,
                                transition: { duration: 0.3, ease: "easeOut" } // hover ra mượt tương tự
                            }}
                            className="relative p-8 bg-white rounded-2xl border border-gray-100 
                                shadow-md hover:shadow-lg transition-all duration-300 ease-out group z-10"
                        >
                            <div
                                className="flex justify-center items-center w-16 h-16 mx-auto mb-5 
                                    rounded-full bg-gradient-to-r from-primary to-teal-400 
                                    text-white shadow-md transition-transform duration-300 ease-out
                                    group-hover:rotate-12 group-hover:scale-110"
                            >
                                {React.cloneElement(r.icon, { size: 32, strokeWidth: 2 })}
                            </div>

                            <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-800">
                                {r.title}
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base">{r.desc}</p>

                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 
                                    bg-gradient-to-r from-gray-200/30 to-gray-700/20
                                    rounded-2xl transition-opacity duration-300 ease-out pointer-events-none"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
