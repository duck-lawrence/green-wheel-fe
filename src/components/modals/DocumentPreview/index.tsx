"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { cn, Skeleton } from "@heroui/react"

import {
    ButtonStyled,
    ImageStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { useGetCitizenIdByUserId, useGetDriverLicenseByUserId } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"

type ImagePreviewModalProps = {
    title: string
    isOpen: boolean
    onOpenChange?: (isOpen: boolean) => void
    frontImageUrl?: string | null
    backImageUrl?: string | null
    isLoading?: boolean
    emptyMessage: string
    footerContent?: React.ReactNode
    isBusy?: boolean
    children?: React.ReactNode
    className?: string
}

export function ImagePreviewModal({
    title,
    isOpen,
    onOpenChange,
    frontImageUrl,
    backImageUrl,
    isLoading = false,
    emptyMessage,
    footerContent,
    isBusy = false,
    children,
    className
}: ImagePreviewModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={cn("max-w-xl", className)}
            isDismissable={!isBusy}
        >
            <ModalContentStyled>
                <ModalHeaderStyled className="text-xl font-semibold text-gray-900">
                    {title}
                </ModalHeaderStyled>
                <ModalBodyStyled className="space-y-6">
                    {/* {actionArea ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            {actionArea}
                        </div>
                    ) : null} */}

                    <div className="space-y-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                        {isLoading ? (
                            <Skeleton className="h-56 w-full rounded-xl" />
                        ) : frontImageUrl && backImageUrl ? (
                            <>
                                <ImageStyled src={frontImageUrl} alt={title} />
                                <ImageStyled src={backImageUrl} alt={title} />
                            </>
                        ) : (
                            <p className="text-center text-sm font-medium text-gray-500">
                                {emptyMessage}
                            </p>
                        )}
                    </div>

                    {children}
                </ModalBodyStyled>
                {footerContent ? <ModalFooterStyled>{footerContent}</ModalFooterStyled> : null}
            </ModalContentStyled>
        </ModalStyled>
    )
}

type BasePreviewModalProps = {
    user: UserProfileViewRes
    isOpen: boolean
    onClose: () => void
    onOpenChange?: (isOpen: boolean) => void
}

export function CitizenIdentityPreviewModal({
    user,
    isOpen,
    onClose,
    onOpenChange
}: BasePreviewModalProps) {
    const { t } = useTranslation()
    const { data: citizenId, isLoading } = useGetCitizenIdByUserId({
        userId: user.id,
        enabled: !!user.citizenUrl
    })

    return (
        <>
            <ImagePreviewModal
                title={t("user.citizen_identity")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                frontImageUrl={citizenId?.frontImageUrl}
                backImageUrl={citizenId?.backImageUrl}
                emptyMessage={t("document_preview.empty_citizen_identity")}
                // actionArea={null}
                footerContent={
                    <div className="flex w-full items-center justify-end gap-3">
                        <ButtonStyled className="bg-default-200 text-gray-700" onPress={onClose}>
                            {t("common.close")}
                        </ButtonStyled>
                    </div>
                }
                isLoading={isLoading}
            />
        </>
    )
}

export function DriverLicensePreviewModal({
    user,
    isOpen,
    onClose,
    onOpenChange
}: BasePreviewModalProps) {
    const { t } = useTranslation()
    const { data: driverLicense, isLoading } = useGetDriverLicenseByUserId({
        userId: user.id,
        enabled: !!user.citizenUrl
    })

    return (
        <>
            <ImagePreviewModal
                title={t("user.driver_license")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                frontImageUrl={driverLicense?.frontImageUrl}
                backImageUrl={driverLicense?.backImageUrl}
                emptyMessage={t("document_preview.empty_driver_license")}
                // actionArea={null}
                footerContent={
                    <div className="flex w-full items-center justify-end gap-3">
                        <ButtonStyled className="bg-default-200 text-gray-700" onPress={onClose}>
                            {t("common.close")}
                        </ButtonStyled>
                    </div>
                }
                isLoading={isLoading}
            />
        </>
    )
}
