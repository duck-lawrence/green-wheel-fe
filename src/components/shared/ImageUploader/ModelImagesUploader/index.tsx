"use client"

import React, { useCallback } from "react"
import { useDeleteModelImages, useImageUploadModal, useUploadModelImages } from "@/hooks"
import { ButtonIconStyled, ImagesUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"
import { cn } from "@heroui/react"
import { Camera } from "lucide-react"
import { BackendError } from "@/models/common/response"
import axios from "axios"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"

export function ModelImagesUploader({
    id,
    btnClassName = "",
    onUploaded,
    initialImages = []
}: {
    id: string
    btnClassName?: string
    onUploaded?: () => void
    initialImages?: string[]
}) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onOpenChange, onClose } = useImageUploadModal()

    const uploadModelImages = useUploadModelImages({
        id,
        onError: onClose,
        onSuccess: () => {
            onClose()
            onUploaded?.()
        }
    })

    const deleteModelImages = useDeleteModelImages({ id })

    const handleUpload = useCallback(
        async (formData: FormData) => {
            try {
                await deleteModelImages.mutateAsync()
                await uploadModelImages.mutateAsync(formData)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data
                    const backendError: BackendError = {
                        title: data?.title ?? "Internal Server Error",
                        status: data?.status ?? error.response?.status,
                        detail: data?.detail ?? error.message
                    }
                    addToast({
                        title: backendError.title || t("toast.error"),
                        description: translateWithFallback(t, backendError.detail),
                        color: "danger"
                    })
                }
            }
        },
        [deleteModelImages, t, uploadModelImages]
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
                isUploadPending={uploadModelImages.isPending || deleteModelImages.isPending}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
                initialImages={initialImages}
            />
        </>
    )
}
