"use client"

import { ImageStyled, SpacerStyled } from "@/components/styled"
import { scrollItemToCenter } from "@/utils/helpers/scrollToCenter"
import React, { useRef } from "react"

interface VehicleSubImagesScrollProps {
    subImgUrls: (string | undefined)[]
    active: number
    setActive: (index: number) => void
}

export const VehicleSubImagesScroll: React.FC<VehicleSubImagesScrollProps> = ({
    subImgUrls,
    active,
    setActive
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    if (subImgUrls?.length === 0) return null

    return (
        <div ref={containerRef} className="overflow-hidden py-2 px-1 scrollbar-none">
            <div className="flex gap-3 max-w-full">
                <SpacerStyled className="w-[2px]" />
                {subImgUrls.map((src, idx) => (
                    <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={(e) => {
                            const container = containerRef.current
                            if (!container) return

                            scrollItemToCenter(container, e.currentTarget)

                            setActive(idx)
                        }}
                        className={`relative flex-shrink-0 aspect-[4/3] overflow-hidden rounded-2xl
                            outline-none ring-2 ring-transparent focus:ring-primary
                            transition-all interactive-scale
                            ${active === idx ? "ring-primary" : ""}
                        `}
                    >
                        <ImageStyled src={src} alt={`thumb ${idx + 1}`} width={150} height={94} />
                    </button>
                ))}
                <SpacerStyled className="w-[2px]" />
            </div>
        </div>
    )
}
