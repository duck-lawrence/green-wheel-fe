"use client"
import React, { useRef } from "react"
import { ButtonStyled } from "@/components/styled"
import { cn } from "@heroui/react"

type ImageUploadButtonProps = {
    onFileSelect: (file: File) => void
    label: string
    accept?: string
    className?: string
    btnClassName?: string
}

export function ImageUploadButton({
    onFileSelect,
    label,
    accept = "image/*",
    className = "",
    btnClassName = ""
}: ImageUploadButtonProps) {
    const fileRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onFileSelect(file)
            // reset input để có thể chọn lại cùng ảnh
            e.target.value = ""
        }
    }

    return (
        <div className={cn("w-fit", className)}>
            <input
                ref={fileRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />
            <ButtonStyled
                className={cn("block w-fit bg-transparent", btnClassName)}
                onPress={() => fileRef.current?.click()}
            >
                {label}
            </ButtonStyled>
        </div>
    )
}
