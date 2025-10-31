"use client"

import React from "react"
import { User } from "@heroui/react"
import { Icon } from "@iconify/react"
import { cn } from "@heroui/react"
import { useDay } from "@/hooks"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"

export type ReviewType = {
    user: {
        name: string
        avatar?: string
    }
    createdAt: string
    rating: number
    title: string
    content: string
}

export type ReviewProps = React.HTMLAttributes<HTMLDivElement> & ReviewType

const Review = React.forwardRef<HTMLDivElement, ReviewProps>(
    ({ children, user, title, content, rating, createdAt, ...props }, ref) => {
        const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

        return (
            <div ref={ref} {...props}>
                <div className="flex items-center gap-2">
                    <User
                        avatarProps={{
                            src: user.avatar
                        }}
                        classNames={{
                            name: "font-medium",
                            description: "text-small"
                        }}
                        description={formatDateTime({ date: createdAt })}
                        name={user.name}
                    />
                </div>
                <div className="mt-4 w-full">
                    <div className="flex justify-between items-start">
                        <div className="text-default-900 font-medium max-w-30 text-left">
                            {title}
                        </div>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => {
                                const isSelected = i + 1 <= rating

                                return (
                                    <Icon
                                        key={i}
                                        className={cn(
                                            "text-lg sm:text-xl",
                                            isSelected ? "text-warning" : "text-default-200"
                                        )}
                                        icon="solar:star-bold"
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <p className="text-left text-default-500 mt-2">{content || children}</p>
                </div>
            </div>
        )
    }
)

Review.displayName = "Review"

export default Review
