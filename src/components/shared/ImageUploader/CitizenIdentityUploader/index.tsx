"use client"

import React from "react"
import { useImageUploadModal, useUploadCitizenId, useUploadCitizenIdById } from "@/hooks"
import { ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"

export function CitizenIdentityUploader({
    btnClassName = "",
    customerId,
    onSuccess
}: {
    btnClassName?: string
    customerId?: string
    onSuccess?: (data: CitizenIdentityViewRes) => void
}) {
    const { t } = useTranslation()
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()

    const uploadCitizenIdById = useUploadCitizenIdById({
        userId: customerId || "",
        onError: onClose,
        onSuccess: (data) => {
            // callback onSuccess để nhận được nguyên dữ liệu trả về từ API (bao gồm imageUrl).
            //  Nhờ vậy component cha (ví dụ EditUserModal) có thể cập nhật ngay phần preview mà không cần gọi lại server.
            //  Nếu không thêm kiểu và không truyền dữ liệu, callback chỉ chạy như “đã xong” nhưng không có thông tin nào để cập nhật giao diện..
            onSuccess?.(data)
        }
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
