"use client"

import React, { ReactNode } from "react"

import { ImageStyled, VehicleSubImagesScroll } from "@/components"

/* ---------- subcomponents ---------- */
type ImagePreviewSectionProps = {
    imageUrls: string[]
    activeImage: number
    onSelectImage: (index: number) => void
    children?: ReactNode
}

export function ImagePreviewSection({
    imageUrls,
    activeImage,
    onSelectImage,
    children
}: ImagePreviewSectionProps) {
    return (
        <section className="space-y-4">
            <header className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <ImageStyled
                    src={imageUrls[activeImage]}
                    alt="vehicle-model-preview"
                    width={720}
                    height={405}
                    className="h-full w-full object-cover"
                />
            </header>

            <VehicleSubImagesScroll
                subImgUrls={imageUrls}
                active={activeImage}
                setActive={onSelectImage}
            />

            <div className="flex justify-end">{children}</div>
        </section>
    )
}
