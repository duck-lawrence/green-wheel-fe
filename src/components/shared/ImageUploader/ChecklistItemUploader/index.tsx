"use client"

import React from "react"
import { useImageUploadModal, useUploadChecklistItem } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function ChecklistItemUploader({
    btnClassName = "",
    checklistId,
    itemId
}: {
    btnClassName?: string
    checklistId: string
    itemId: string
}) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()
    const upload = useUploadChecklistItem({ checklistId, itemId, onError: onClose })

    return (
        <>
            <ImageUploadButton
                color="primary"
                label={t("common.upload")}
                onFileSelect={onFileSelect}
                btnClassName={btnClassName}
            />
            <ImageUploaderModal
                label={t("common.upload")}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                uploadFn={upload.mutateAsync}
                isUploadPending={upload.isPending}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
            />
        </>
    )
}
