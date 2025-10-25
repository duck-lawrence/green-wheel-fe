"use client"

import React, { memo } from "react"
import { ButtonStyled, ImageStyled } from "@/components/"
import { X } from "@phosphor-icons/react"

export const PreviewList = memo(function PreviewList({
    images,
    cropSize,
    onRemove
}: {
    images: { blob: Blob; url: string }[]
    cropSize: { width: number; height: number }
    onRemove: (index: number) => void
}) {
    return (
        <div className="grid grid-cols-3 gap-3 w-full">
            {images.map((img, idx) => (
                <div key={idx} className="relative group">
                    <ImageStyled
                        src={img.url}
                        alt={`preview-${idx}`}
                        width={cropSize.width}
                        height={cropSize.height}
                    />
                    <ButtonStyled
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity min-w-fit min-h-fit h-fit p-2"
                        onClick={() => onRemove(idx)}
                    >
                        <X size={16} />
                    </ButtonStyled>
                </div>
            ))}
        </div>
    )
})
