"use client"

import React from "react"
import { useImageUploadModal, useUploadCitizenId, useUploadCitizenIdById } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function CitizenIdentityUploader({
    btnClassName = "",
    customerId
}: {
    btnClassName?: string
    customerId?: string
}) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()

    const uploadCitizenIdById = useUploadCitizenIdById({
        userId: customerId || "",
        onError: onClose
    })
    const uploadCitizenId = useUploadCitizenId({ onError: onClose })

    const currentUpload = customerId ? uploadCitizenIdById : uploadCitizenId

    return (
        <>
            <ImageUploadButton
                label={t("user.upload_citizen_identity")}
                onFileSelect={onFileSelect}
                btnClassName={btnClassName}
            />
            <ImageUploaderModal
                label={t("user.upload_citizen_identity")}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                uploadFn={currentUpload.mutateAsync}
                isUploadPending={currentUpload.isPending}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
            />
        </>
    )
}
