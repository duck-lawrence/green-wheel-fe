import React from "react"
import Image from "next/image"
import { cn } from "@heroui/react"
import { FALLBACK_IMAGE_URL } from "@/constants/constants"

export function ImageStyled({
    src,
    alt,
    className,
    width,
    height
}: {
    src?: string
    alt: string
    className?: string
    width?: number
    height?: number
}) {
    return (
        <Image
            alt={alt}
            src={src || FALLBACK_IMAGE_URL}
            className={cn("object-cover rounded-xl", className)}
            width={width || 500}
            height={height || 500}
        />
    )
}
