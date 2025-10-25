"use client"

import React, { useCallback, useState } from "react"
import { ModalStyled, ButtonStyled, ImageCropper, ImageUploadButton } from "@/components/"
import { ModalContent, ModalBody, ModalHeader, Spinner } from "@heroui/react"
import { getCroppedImage } from "@/utils/helpers/image"
import { useTranslation } from "react-i18next"
import { Check, X } from "@phosphor-icons/react"
import { PreviewList } from "./PreviewList"

type ImagesUploaderModalProps = {
    label?: string
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
    aspect?: number
    cropShape?: "rect" | "round"
    cropSize: { width: number; height: number }
    uploadFn: (formData: FormData) => Promise<any>
    isUploadPending: boolean
}

export function ImagesUploaderModal({
    label = "",
    isOpen,
    onOpenChange,
    onClose,
    uploadFn,
    isUploadPending,
    aspect = 1,
    cropShape = "rect",
    cropSize
}: ImagesUploaderModalProps) {
    const { t } = useTranslation()
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [croppedImages, setCroppedImages] = useState<{ blob: Blob; url: string }[]>([])

    const handleFileSelect = (file: File) => {
        const src = URL.createObjectURL(file)
        setImgSrc(src)
    }

    const handleCropDone = useCallback(async () => {
        if (!imgSrc || !croppedAreaPixels) return
        const blob = await getCroppedImage(imgSrc, croppedAreaPixels)
        const url = URL.createObjectURL(blob)

        setCroppedImages((prev) => [...prev, { blob, url }])
        setImgSrc(null)
    }, [croppedAreaPixels, imgSrc])

    const handleRemovePreview = (index: number) => {
        setCroppedImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmitAll = useCallback(async () => {
        if (!croppedImages.length) return
        const formData = new FormData()
        croppedImages.forEach((item, i) => {
            formData.append("files", item.blob, `image_${i + 1}.jpg`)
        })

        await uploadFn(formData)
        setCroppedImages([])
        onClose()
    }, [croppedImages, uploadFn, onClose])

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={() => {
                if (!isUploadPending) onOpenChange()
            }}
            isDismissable={!isUploadPending}
        >
            <ModalContent className="w-full min-w-fit p-4">
                <ModalHeader className="px-3 py-2 self-center">{label}</ModalHeader>
                <ModalBody>
                    {imgSrc ? (
                        <div className="flex flex-col items-center gap-4">
                            <ImageCropper
                                imgSrc={imgSrc}
                                onCropComplete={setCroppedAreaPixels}
                                aspect={aspect}
                                cropShape={cropShape}
                                cropSize={cropSize}
                            />
                            <div className="flex gap-3">
                                <ButtonStyled
                                    color="primary"
                                    variant="ghost"
                                    onPress={handleCropDone}
                                    isDisabled={isUploadPending}
                                >
                                    <Check size={18} />
                                </ButtonStyled>
                                <ButtonStyled
                                    onPress={() => setImgSrc(null)}
                                    isDisabled={isUploadPending}
                                >
                                    <X size={18} />
                                </ButtonStyled>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <ImageUploadButton onFileSelect={handleFileSelect} color="secondary" />

                            {croppedImages.length > 0 && (
                                <PreviewList
                                    images={croppedImages}
                                    cropSize={{ width: 400, height: 250 }}
                                    onRemove={handleRemovePreview}
                                />
                            )}

                            <div className="flex justify-end gap-3 mt-3 w-full">
                                <ButtonStyled
                                    color="primary"
                                    onPress={handleSubmitAll}
                                    isDisabled={isUploadPending || !croppedImages.length}
                                >
                                    {isUploadPending ? (
                                        <Spinner color="white" />
                                    ) : (
                                        t("common.upload")
                                    )}
                                </ButtonStyled>
                                <ButtonStyled onPress={onClose} isDisabled={isUploadPending}>
                                    {t("common.close")}
                                </ButtonStyled>
                            </div>
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
