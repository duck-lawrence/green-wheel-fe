"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RentalContractStatus } from "@/constants/enum"
import { RentalContractStatusLabels } from "@/constants/labels"

const steps = [
    {
        key: RentalContractStatus.RequestPending,
        label: RentalContractStatusLabels[RentalContractStatus.RequestPending]
    },
    {
        key: RentalContractStatus.PaymentPending,
        label: RentalContractStatusLabels[RentalContractStatus.PaymentPending]
    },
    {
        key: RentalContractStatus.Active,
        label: RentalContractStatusLabels[RentalContractStatus.Active]
    },
    {
        key: RentalContractStatus.Returned,
        label: RentalContractStatusLabels[RentalContractStatus.Returned]
    },
    {
        key: RentalContractStatus.RefundPending,
        label: RentalContractStatusLabels[RentalContractStatus.RefundPending]
    }
]

export function StepContract({ status }: { status?: RentalContractStatus }) {
    const [currentIndex, setCurrentIndex] = useState(steps.findIndex((s) => s.key === status))

    // thay đổi step
    useEffect(() => {
        const newIndex = steps.findIndex((s) => s.key === status)
        if (newIndex !== -1) setCurrentIndex(newIndex)
    }, [status])

    const progressWidth = (currentIndex / (steps.length - 1)) * 80

    return (
        <div
            className="w-[45rem]
        relative  flex flex-col items-center justify-center py-12"
        >
            {/* ======================================== */}
            {/* thanh nền xám */}
            <div
                className="w-[39rem]
            absolute top-[42%] left-0 right-0 h-[4px] bg-gray-300 rounded-full "
            />

            {/* Thanh điện có animation khi thay đổi */}
            <motion.div
                className="absolute top-[42%] left-1 h-[4px] rounded-full 
                   bg-gradient-to-r from-primary via-teal-400 to-green-400 
                   bg-[length:200%] animate-[flow_3s_linear_infinite]
                   shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                animate={{ width: `${progressWidth}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Spark hiệu ứng chạy */}
            <div
                className="absolute top-[42%] left-0 h-[6px] overflow-visible"
                style={{ width: `${progressWidth}%` }}
            >
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 
                       shadow-[0_0_8px_3px_rgba(20,184,166,0.6)]"
                        style={{
                            top: "50%",
                            transform: "translateY(-50%)",
                            animation: `sparkX 4s linear ${i * 0.6}s infinite`
                        }}
                    />
                ))}
            </div>

            {/* Step nodes */}
            <div className="relative flex w-full max-w-4xl justify-between z-10 mr-26">
                {steps.map((step, index) => {
                    const isActive = index <= currentIndex
                    return (
                        <motion.div
                            key={step.key}
                            className="flex flex-col items-center w-full"
                            // initial={{ opacity: 0, y: 10 }}
                            // animate={{ opacity: 1, y: 0 }}
                        >
                            <motion.div
                                animate={{
                                    backgroundColor: isActive ? "#14b8a6" : "#fff",
                                    borderColor: isActive ? "#14b8a6" : "#ccc",
                                    color: isActive ? "#fff" : "#999",
                                    boxShadow: isActive ? "0 0 25px rgba(14,164,122,0.7)" : "none"
                                }}
                                transition={{ duration: 0.4 }}
                                className="text-[18px]
                                flex items-center justify-center w-14 h-14 rounded-full border-4  font-semibold"
                            >
                                {index + 1}
                            </motion.div>

                            <span
                                className={`mt-3 text-sm font-medium ${
                                    isActive ? "text-teal-500" : "text-gray-400"
                                }`}
                            >
                                {step.label}
                            </span>
                        </motion.div>
                    )
                })}
            </div>
            {/* ======================================== */}

            {/* Keyframes */}
            <style>{`
                @keyframes flow {
                    0% {
                        background-position: 0% 50%;
                    }
                    100% {
                        background-position: 200% 50%;
                    }
                }
                @keyframes sparkX {
                    0% {
                        left: 0%;
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        left: 100%;
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}
