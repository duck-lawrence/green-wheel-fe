"use client"

import React from "react"
import { useImageUploadModal, useUploadDriverLicense, useUploadDriverLicenseById } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"

export function DriverLicenseUploader({
    btnClassName = "",
    customerId,
    onSuccess
}: {
    btnClassName?: string
    customerId?: string
    // callback onSuccess để nhận được nguyên dữ liệu trả về từ API (bao gồm imageUrl).
    //  Nhờ vậy component cha (ví dụ EditUserModal) có thể cập nhật ngay phần preview mà không cần gọi lại server.
    //  Nếu không thêm kiểu và không truyền dữ liệu, callback chỉ chạy như “đã xong” nhưng không có thông tin nào để cập nhật giao diện..
    onSuccess?: (data: DriverLicenseViewRes) => void
}) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()
    const uploadDriverLicenseById = useUploadDriverLicenseById({
        userId: customerId || "",
        onError: onClose,
        onSuccess: (data) => {
            onSuccess?.(data)
        }
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
