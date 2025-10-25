"use client"

import React, { useCallback } from "react"
import { useImageUploadModal, useUploadModelImages } from "@/hooks"
import { ButtonIconStyled, ImagesUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"
import { cn } from "@heroui/react"
import { Camera } from "lucide-react"

export function ModelImagesUploader({
    id,
    btnClassName = ""
}: {
    id: string
    btnClassName?: string
}) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onOpenChange, onClose } = useImageUploadModal()

    const uploadModelImages = useUploadModelImages({
        id,
        onError: onClose,
        onSuccess: onClose
    })
    const handleUpload = useCallback(
        async (formData: FormData) => await uploadModelImages.mutateAsync(formData),
        [uploadModelImages]
    )

    return (
        <>
            <ButtonIconStyled
                color="primary"
                variant="ghost"
                isDisabled={uploadModelImages.isPending}
                className={cn(
                    "w-fit px-4 py-2 rounded-lg flex items-center justify-center",
                    btnClassName
                )}
                onPress={onOpen}
            >
                <Camera size={18} fontWeight="fill" />
            </ButtonIconStyled>
            <ImagesUploaderModal
                key={isOpen ? "open" : "closed"}
                label={t("vehicle_model.upload_images")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                uploadFn={handleUpload}
                isUploadPending={uploadModelImages.isPending}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
            />
        </>
    )
}
