"use client"

import React from "react"
import { useImageUploadModal, useUploadDriverLicense } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function DriverLicenseUploader({ btnClassName = "" }: { btnClassName?: string }) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()
    const uploadDriverLicense = useUploadDriverLicense({ onError: onClose })

    return (
        <>
            <ImageUploadButton
                label={t("user.upload_driver_license")}
                onFileSelect={onFileSelect}
                btnClassName={btnClassName}
            />
            <ImageUploaderModal
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                uploadFn={uploadDriverLicense.mutateAsync}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
                label={t("user.upload_driver_license")}
            />
        </>
    )
}
