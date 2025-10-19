"use client"

import React, { useState } from "react"
import { useImageUploadModal, useUploadChecklistItemImage } from "@/hooks"
import { ImageStyled, ImageUploadButton, ImageUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"

export function ChecklistItemUploader({
    btnClassName = "",
    isEditable,
    itemId,
    itemImg
}: {
    btnClassName?: string
    isEditable: boolean
    itemId: string
    itemImg?: string
}) {
    const { t } = useTranslation()
    const [displayImg, setDisplayImg] = useState<string | undefined>(itemImg)
    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal()
    const upload = useUploadChecklistItemImage({ itemId, onError: onClose })

    return (
        <>
            {displayImg && (
                <ImageStyled
                    alt={t("vehicle_checklist.item_image")}
                    src={displayImg}
                    width={200}
                    height={125}
                />
            )}
            {isEditable && (
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
                        setDisplayImg={setDisplayImg}
                        isUploadPending={upload.isPending}
                        cropShape="rect"
                        cropSize={{ width: 700, height: 437.5 }}
                    />
                </>
            )}
        </>
    )
}
