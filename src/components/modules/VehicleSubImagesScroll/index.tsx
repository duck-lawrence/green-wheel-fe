"use client"

import { ImageStyled } from "@/components/styled"
import { animate } from "framer-motion"
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

    const animateScroll = (target: number) => {
        const el = containerRef.current
        if (!el) return

        const maxScroll = el.scrollWidth - el.clientWidth
        const newX = Math.max(0, Math.min(target, maxScroll))

        // Tạo hiệu ứng cuộn mượt có easing
        const controls = animate(el.scrollLeft, newX, {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier chuẩn CSS
            onUpdate: (v) => {
                el.scrollLeft = v
            }
        })

        return () => controls.stop()
    }

    const handleScroll = (delta: number) => {
        const el = containerRef.current
        if (!el) return
        animateScroll(el.scrollLeft + delta)
    }

    if (!subImgUrls?.length) return null

    return (
        <div ref={containerRef} className="overflow-hidden py-2 px-1 scrollbar-none">
            <div className="flex gap-3 max-w-full">
                {subImgUrls.map((src, idx) => (
                    <button
                        key={`${src}-${idx}`}
                        onClick={(e) => {
                            setActive(idx)

                            const container = containerRef.current
                            if (!container) return

                            const rect = e.currentTarget.getBoundingClientRect()
                            const parentRect = container.getBoundingClientRect()

                            const isRight = rect.right > parentRect.right - 10
                            const isLeft = rect.left < parentRect.left + 10

                            if (isRight) handleScroll(180)
                            else if (isLeft) handleScroll(-180)
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
            </div>
        </div>
    )
}
