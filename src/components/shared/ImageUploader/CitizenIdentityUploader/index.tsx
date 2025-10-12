"use client"

import React from "react"
import { useImageUploadModal, useUploadCitizenId } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function CitizenIdentityUploader({ btnClassName = "" }: { btnClassName?: string }) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()
    const uploadCitizenId = useUploadCitizenId({ onError: onClose })

    return (
        <>
            <ImageUploadButton
                label={t("user.upload_citizen_identity")}
                onFileSelect={onFileSelect}
                btnClassName={btnClassName}
            />
            <ImageUploaderModal
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                uploadFn={uploadCitizenId.mutateAsync}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
                label={t("user.upload_citizen_identity")}
            />
        </>
    )
}
