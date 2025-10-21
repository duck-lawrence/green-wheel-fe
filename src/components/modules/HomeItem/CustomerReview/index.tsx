"use client"
import { motion } from "framer-motion"
import { ButtonStyled } from "@/components"
import React from "react"
import CardReviewUser from "@/components/styled/GrateStyled"

type Review = {
    id: string
    name: string
    avatar: string
    rating: number
    title: string
    content: string
    createdAt: string
}

type Props = {
    reviews: Review[]
    onAddReview?: () => void
}

export default function CustomerReview({ reviews, onAddReview }: Props) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
            `}</style>

            {/* Header */}
            <div className="max-w-6xl mx-auto px-6 mb-12 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Khách hàng đánh giá
                    </h2>
                    <ButtonStyled onPress={onAddReview}>Gửi phản hồi</ButtonStyled>
                </div>

                {/* Spark energy line */}
                <div
                    className="relative h-[4px] w-40 bg-gradient-to-r from-primary via-teal-400 to-green-400
                               bg-[length:200%] animate-[flow_3s_linear_infinite] rounded-full opacity-70 overflow-hidden"
                >
                    <span
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                                   bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                        style={{ animation: "spark-move 2.5s linear infinite" }}
                    ></span>
                </div>
            </div>

            {/* Reviews scroll list */}
            <div className="max-w-7xl mx-auto relative z-10">
                <div
                    className="flex gap-6 overflow-x-auto px-6 py-6
                               scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100
                               snap-x snap-mandatory scroll-smooth"
                >
                    {reviews.map((review, key) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: key * 0.05 }}
                            viewport={{ once: true }}
                            className="snap-center flex-shrink-0"
                        >
                            <CardReviewUser
                                name={review.name}
                                avatar={review.avatar}
                                rating={review.rating}
                                title={review.title}
                                content={review.content}
                                createdAt={review.createdAt}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
