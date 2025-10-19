import React from "react"
import CardReview from "./CardReview"
import { cn } from "@heroui/react"

type CardReviewProps = {
    content?: string
    rating?: number
    title?: string
    name?: string
    avatar?: string
    className?: string
}
export default function CardReviewUser(props: CardReviewProps) {
    return (
        <div className={cn("flex flex-col gap-4", props.className)}>
            <CardReview
                content="Arcu dui vivamus arcu felis bibendum. Amet tellus cras adipiscing enim eu turpis egestas pretium. "
                createdAt="2021-08-01T12:00:00.000Z"
                rating={props.rating ?? 0}
                title={props.title ?? ""}
                user={{
                    name: props.name ?? "",
                    avatar: props.avatar ?? ""
                }}
            />
        </div>
    )
}
