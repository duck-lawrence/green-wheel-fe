"use client"

import React from "react"
import { useImageUploadModal, useUploadDriverLicense, useUploadDriverLicenseById } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function DriverLicenseUploader({
    btnClassName = "",
    customerId
}: {
    btnClassName?: string
    customerId?: string
}) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()
    const uploadDriverLicenseById = useUploadDriverLicenseById({
        userId: customerId || "",
        onError: onClose
    })
    const uploadDriverLicense = useUploadDriverLicense({ onError: onClose })

    const currentUpload = customerId ? uploadDriverLicenseById : uploadDriverLicense

    return (
        <>
            <ImageUploadButton
                label={t("user.upload_driver_license")}
                onFileSelect={onFileSelect}
                btnClassName={btnClassName}
            />
            <ImageUploaderModal
                label={t("user.upload_driver_license")}
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
