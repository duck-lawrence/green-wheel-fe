"use client"

import React from "react"
import { useImageUploadModal, useUploadCitizenId, useUploadCitizenIdById } from "@/hooks"
import { ButtonIconStyled, ImagesUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { cn } from "@heroui/react"
import { Camera } from "lucide-react"

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
    const { isOpen, onOpen, onOpenChange, onClose } = useImageUploadModal()

    const uploadCitizenIdById = useUploadCitizenIdById({
        userId: customerId || "",
        onError: onClose,
        onSuccess: (data) => {
            onSuccess?.(data)
        }
    })
    const uploadCitizenId = useUploadCitizenId({ onError: onClose })

    const currentUpload = customerId ? uploadCitizenIdById : uploadCitizenId

    return (
        <>
            <ButtonIconStyled
                color="primary"
                variant="ghost"
                isDisabled={currentUpload.isPending}
                className={cn(
                    "w-fit px-4 py-2 rounded-lg flex items-center justify-center",
                    btnClassName
                )}
                onPress={onOpen}
            >
                <Camera size={18} fontWeight="fill" />
                {t("user.upload_citizen_identity")}
            </ButtonIconStyled>
            <ImagesUploaderModal
                key={isOpen ? "open" : "closed"}
                label={t("user.upload_citizen_identity")}
                notes={t("user.upload_first_then_back_image")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
                uploadFn={currentUpload.mutateAsync}
                isUploadPending={currentUpload.isPending}
                minAmount={2}
                maxAmount={2}
                listClassName="md:grid-cols-2"
            />
        </>
    )

    // return (
    //     <>
    //         <ImageUploadButton
    //             label={t("user.upload_citizen_identity")}
    //             onFileSelect={onFileSelect}
    //             btnClassName={btnClassName}
    //         />
    //         <ImageUploaderModal
    //             label={t("user.upload_citizen_identity")}
    //             imgSrc={imgSrc}
    //             setImgSrc={setImgSrc}
    //             isOpen={isOpen}
    //             onOpenChange={onOpenChange}
    //             onClose={onClose}
    //             uploadFn={currentUpload.mutateAsync}
    //             isUploadPending={currentUpload.isPending}
    //             cropShape="rect"
    //             cropSize={{ width: 700, height: 437.5 }}
    //         />
    //     </>
    // )
}
