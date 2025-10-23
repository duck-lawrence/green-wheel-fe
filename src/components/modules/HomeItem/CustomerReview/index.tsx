"use client"
import { motion } from "framer-motion"
import { ButtonStyled, FeedbackModal } from "@/components"
import React from "react"
import CardReviewUser from "@/components/styled/GrateStyled"
import { useTranslation } from "react-i18next"
import { useDisclosure } from "@heroui/react"
import { useGetAllFeedback, useGetAllStations } from "@/hooks"

export function CustomerReview() {
    const { t } = useTranslation()
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    const { data: feedbacks, isLoading } = useGetAllFeedback()

    const { data: station, isFetching } = useGetAllStations()

    //===========ANIMATION==================

    //===========ANIMATION==================
    if (isLoading && isFetching) return "Loading..."

    return (
        <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="py-24 bg-transparent relative overflow-hidden"
        >
            <style>{`
                @keyframes flow {
                    0% { background-position: 0 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes spark-move {
                    0% { left: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                @keyframes floating {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                    100% { transform: translateY(0); }
                }
            `}</style>

            {/* Màu hiệu ứng backGround */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.08),transparent_70%)]"></div> */}

            {/* Header */}
            <div className="max-w-6xl mx-auto px-6 mb-14 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-wide text-center md:text-left">
                        {t("review.customer_review")}
                    </h2>
                    <ButtonStyled
                        onPress={onOpen}
                        className="hover:scale-[1.03] transition-transform duration-300 shadow-md border border-gray-400 "
                        //  btn-gradient btn-gradient:hover btn-gradient:active
                    >
                        {t("review.create_feedback")}
                    </ButtonStyled>
                    <FeedbackModal
                        id="feedback-modal"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        onClose={onClose}
                    />
                </div>

                <div
                    className="relative h-[5px] w-48 bg-gradient-to-r from-primary via-emerald-400 to-teal-500
                                bg-[length:200%] animate-[flow_3s_linear_infinite] rounded-full opacity-80 overflow-hidden"
                >
                    <span
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full
                                   bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.9)]"
                        style={{ animation: "spark-move 2.8s linear infinite" }}
                    ></span>
                </div>
            </div>

            {/* Reviews scroll list */}
            <div className="max-w-7xl mx-auto relative z-10 overflow-hidden">
                <motion.div
                    className="flex gap-8 px-8 py-8"
                    animate={{
                        x: ["0%", "-150%"]
                    }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 25 // chỉnh tốc độ (s) ở đây
                    }}
                    whileHover={{ animationPlayState: "paused" }}
                >
                    {/* [...feedbacks, ...feedbacks, ...feedbacks] */}

                    {feedbacks &&
                        feedbacks.map((item, key) => (
                            <motion.div
                                key={item.id + "-" + key}
                                whileHover={{
                                    scale: 1.04,
                                    y: -4,
                                    boxShadow: "0 10px 25px rgba(16,185,129,0.15)"
                                }}
                                className="snap-center flex-shrink-0 transform-gpu transition-transform duration-300"
                            >
                                <CardReviewUser
                                    name={item.customerName}
                                    // avatar={item.avatar}
                                    rating={item.rating}
                                    station={
                                        (item.stationId == station?.[0].id
                                            ? station?.[0].name
                                            : station?.[1].name) ?? ""
                                    }
                                    content={item.content}
                                    createdAt={item.createdAt}
                                />
                            </motion.div>
                        ))}
                </motion.div>
            </div>

            {/* Decor*/}
            <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-300 rounded-full opacity-60 animate-[floating_3s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-[floating_4s_ease-in-out_infinite]" />
            <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full opacity-70 animate-[floating_3.5s_ease-in-out_infinite]" />
        </motion.section>
    )
}
