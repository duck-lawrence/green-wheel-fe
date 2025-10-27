"use client"

import React from "react"
import { useImageUploadModal, useUploadInvoiceImage } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function InvoiceUploader({
    btnClassName = "",
    id,
    contractId
}: {
    btnClassName?: string
    id: string
    contractId: string
}) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()

    const uploadMutation = useUploadInvoiceImage({ id, contractId, onSuccess: onClose })

    return (
        <>
            <ImageUploadButton
                label={t("invoice.upload_image")}
                onFileSelect={onFileSelect}
                btnClassName={btnClassName}
            />
            <ImageUploaderModal
                label={t("invoice.upload_image")}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                uploadFn={uploadMutation.mutateAsync}
                isUploadPending={uploadMutation.isPending}
                cropShape="rect"
                cropSize={{ width: 375, height: 500 }}
            />
        </>
    )
}
