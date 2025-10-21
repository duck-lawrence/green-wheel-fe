import React from "react"
import CardReview from "./CardReview"
import { cn } from "@heroui/react"

type CardReviewProps = {
    name: string
    avatar: string
    rating: number
    title: string
    content: string
    createdAt: string
    className?: string
}

export default function CardReviewUser({
    name,
    avatar,
    rating,
    title,
    content,
    createdAt,
    className
}: CardReviewProps) {
    return (
        <div className={cn("flex flex-col gap-4 min-w-[300px] max-w-sm", className)}>
            <CardReview
                content={content}
                createdAt={createdAt}
                rating={rating}
                title={title}
                user={{
                    name,
                    avatar
                }}
            />
        </div>
    )
}
