"use client"
import React from "react"
import { motion } from "framer-motion"
import { GREENWHEEL } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import { StepItem } from "./StepItem"
import { Car, CreditCard, Search, Send } from "lucide-react"

export function HowToRent() {
    const { t } = useTranslation()

    const bookingSteps = [
        {
            id: "1",
            icon: <Search />,
            title: t("home.step_1"),
            desc: t("home.step_1_desc")
        },
        {
            id: "2",
            icon: <Send />,
            title: t("home.step_2"),
            desc: t("home.step_2_desc")
        },
        {
            id: "3",
            icon: <CreditCard />,
            title: t("home.step_3"),
            desc: t("home.step_3_desc")
        },
        {
            id: "4",
            icon: <Car />,
            title: t("home.step_4"),
            desc: t("home.step_4_desc")
        }
    ]

    return (
        <section className="bg-transparent text-[#1e2b3a] py-24 overflow-hidden relative">
            <style>{`
        @keyframes flow {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spark {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes sparkMove {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="text-center mb-20 relative flex flex-col justify-center">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-lg font-semibold text-teal-500 uppercase tracking-wide"
                    >
                        {t("home.rental_steps")}
                    </motion.h2>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-primary mb-6"
                    >
                        {t("home.how_to_rent_with")}{" "}
                        <span className="text-teal-500">{GREENWHEEL}</span>
                    </motion.h3>

                    {/* Dòng năng lượng + spark ngang */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-52 h-[4px]
                       bg-gradient-to-r from-primary via-teal-400 to-green-400
                       bg-[length:200%] animate-[flow_3s_linear_infinite]
                       rounded-full opacity-70 overflow-hidden"
                    >
                        {/* Spark nhỏ chạy ngang */}
                        <span
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                         bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                            style={{ animation: "sparkMove 2.5s linear infinite" }}
                        ></span>
                    </motion.div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Dòng điện trung tâm */}
                    <div
                        className="hidden md:block absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 
                       bg-[length:200%] animate-[flow_3s_linear_infinite]
                       bg-gradient-to-b from-primary via-teal-400 to-green-400 opacity-70 rounded-full"
                    />

                    {/* Hiệu ứng spark dọc */}
                    <div className="hidden md:block absolute left-[49.5%] -translate-x-1/5 top-0 h-full w-[6px] overflow-visible">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <span
                                key={i}
                                className="absolute left-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 shadow-[0_0_8px_3px_rgba(20,184,166,0.6)]"
                                style={{
                                    animation: `spark 4s linear ${i * 0.6}s infinite`
                                }}
                            />
                        ))}
                    </div>

                    {/* Các item */}
                    <div className="flex flex-col gap-20">
                        {bookingSteps.map((step, idx) => (
                            <StepItem key={step.id} step={step} isLeft={idx % 2 === 0} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
