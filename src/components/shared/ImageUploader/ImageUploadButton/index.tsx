"use client"
import React, { useRef } from "react"
import { ButtonIconStyled, ButtonStyled } from "@/components/styled"
import { cn } from "@heroui/react"
import { Camera } from "lucide-react"

type ImageUploadButtonProps = {
    onFileSelect: (file: File) => void
    label?: string
    accept?: string
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
    className?: string
    btnClassName?: string
}

export function ImageUploadButton({
    onFileSelect,
    label = "",
    accept = "image/*",
    color = "secondary",
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

            {label ? (
                <ButtonStyled
                    color={color}
                    className={cn(
                        "w-fit px-4 py-2 rounded-lg flex items-center justify-center",
                        btnClassName
                    )}
                    onPress={() => fileRef.current?.click()}
                >
                    <Camera size={18} fontWeight="fill" />
                    {label}
                </ButtonStyled>
            ) : (
                <ButtonIconStyled
                    color={color}
                    className={cn(btnClassName)}
                    onPress={() => fileRef.current?.click()}
                >
                    <Camera size={18} fontWeight="fill" />
                </ButtonIconStyled>
            )}
        </div>
    )
}
