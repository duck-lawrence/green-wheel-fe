"use client"
import { motion } from "framer-motion"
import { ButtonStyled, FeedbackModal, SpacerStyled } from "@/components"
import React, { useCallback, useRef } from "react"
import CardReviewUser from "@/components/styled/GrateStyled"
import { useTranslation } from "react-i18next"
import { Spinner, useDisclosure } from "@heroui/react"
import { useGetAllFeedback, useGetAllStations, useGetMe, useTokenStore } from "@/hooks"
import toast from "react-hot-toast"
import { RoleName } from "@/constants/enum"
import { scrollItemToCenter } from "@/utils/helpers/scrollToCenter"

export function CustomerReview() {
    const { t } = useTranslation()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const { data: user } = useGetMe({ enabled: isLogined })

    const { data: feedbacks, isLoading } = useGetAllFeedback()

    const { data: station, isFetching } = useGetAllStations()
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    const handleOpen = useCallback(() => {
        if (!isLogined) {
            toast.error(t("login.please_login"))
            return
        }

        if (user?.role?.name !== RoleName.Customer) {
            toast.error(t("auth.only_customer"))
            return
        }
        onOpen()
    }, [isLogined, onOpen, t, user?.role?.name])

    //===========ANIMATION==================
    const containerRef = useRef<HTMLDivElement | null>(null)

    if ((isLoading && isFetching) || (feedbacks || []).length === 0) return <Spinner />

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
            <div className="max-w-6xl mx-auto px-6 mb-3 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-wide text-center md:text-left">
                        {t("review.customer_review")}
                    </h2>
                    <ButtonStyled
                        variant="ghost"
                        color="default"
                        onPress={handleOpen}
                        className="interactive-scale"
                    >
                        {t("review.send_feedback")}
                    </ButtonStyled>
                    <FeedbackModal
                        id="feedback-modal"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        onClose={onClose}
                    />
                </div>

                <div
                    className="relative h-[5px] w-full md:w-48 bg-gradient-to-r from-primary via-emerald-400 to-teal-500
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
            <div
                ref={containerRef}
                className="max-w-7xl mx-auto relative z-10 overflow-hidden py-2 px-1 scrollbar-none 
                    [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
            >
                <div className="flex gap-6 max-w-full">
                    <SpacerStyled />
                    {(feedbacks || []).map((item, idx) => (
                        <button
                            key={`${item}-${idx}`}
                            onClick={(e) => {
                                const container = containerRef.current
                                if (!container) return

                                scrollItemToCenter(container, e.currentTarget)
                            }}
                            className="max-h-fit relative flex-shrink-0 overflow-hidden rounded-2xl
                                outline-none ring-2 ring-transparent focus:ring-primary
                                interactive-scale"
                        >
                            <CardReviewUser
                                name={item.customerName}
                                avatar={item.avartarUrl}
                                rating={item.rating}
                                station={
                                    (item.stationId == station?.[0].id
                                        ? station?.[0].name
                                        : station?.[1].name) ?? ""
                                }
                                content={item.content}
                                createdAt={item.createdAt}
                            />
                        </button>
                    ))}
                    <SpacerStyled />
                </div>
            </div>

            {/* Decor*/}
            <div className="absolute top-10 left-1/4 w-2 h-2 bg-emerald-300 rounded-full opacity-60 animate-[floating_3s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-[floating_4s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full opacity-70 animate-[floating_3.5s_ease-in-out_infinite]" />
        </motion.section>
    )
}
