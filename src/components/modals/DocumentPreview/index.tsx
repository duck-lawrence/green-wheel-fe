"use client"

import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
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
import { useDeleteCitizenIdById, useDeleteDriverLicense } from "@/hooks/queries/useUser"
import { QUERY_KEYS } from "@/constants/queryKey"

type ImagePreviewModalProps = {
    title: string
    isOpen: boolean
    onClose: () => void
    onOpenChange?: (isOpen: boolean) => void
    imageUrl?: string | null
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
    onClose,
    onOpenChange,
    imageUrl,
    isLoading = false,
    emptyMessage,
    footerContent,
    isBusy = false,
    children,
    className
}: ImagePreviewModalProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
        onOpenChange?.(open)
    }

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
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

                    <div className="relative flex min-h-[260px] w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                        {isLoading ? (
                            <Skeleton className="h-56 w-full rounded-xl" />
                        ) : imageUrl ? (
                            <ImageStyled
                                src={imageUrl}
                                alt={title}
                                className="h-auto w-full max-h-[380px] !object-contain"
                            />
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
    userId: string
    isOpen: boolean
    onClose: () => void
    onOpenChange?: (isOpen: boolean) => void
    imageUrl?: string | null
    onUpdated?: (nextUrl: string | null) => void
}

export function CitizenIdentityPreviewModal({
    userId,
    isOpen,
    onClose,
    onOpenChange,
    imageUrl,
    onUpdated
}: BasePreviewModalProps) {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [currentUrl, setCurrentUrl] = useState<string | null>(imageUrl ?? null)

    const deleteCitizenIdentity = useDeleteCitizenIdById({
        onSuccess: () => {
            setCurrentUrl(null)
            onUpdated?.(null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
        }
    })

    useEffect(() => {
        if (isOpen) {
            setCurrentUrl(imageUrl ?? null)
        }
    }, [imageUrl, isOpen])

    const isBusy = deleteCitizenIdentity.isPending

    const handleDelete = async () => {
        if (!currentUrl) return
        const confirmed = window.confirm(t("document_preview.delete_confirm"))
        if (!confirmed) return
        await deleteCitizenIdentity.mutateAsync(userId)
    }

    return (
        <>
            <ImagePreviewModal
                title={t("user.citizen_identity")}
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
                imageUrl={currentUrl ?? undefined}
                emptyMessage={t("document_preview.empty_citizen_identity")}
                // actionArea={null}
                footerContent={
                    <div className="flex w-full items-center justify-end gap-3">
                        <ButtonStyled
                            className="bg-danger-500 text-white"
                            onPress={handleDelete}
                            isDisabled={isBusy || !currentUrl}
                        >
                            {t("common.delete")}
                        </ButtonStyled>
                        <ButtonStyled
                            className="bg-default-200 text-gray-700"
                            onPress={onClose}
                            isDisabled={isBusy}
                        >
                            {t("common.close")}
                        </ButtonStyled>
                    </div>
                }
                isBusy={isBusy}
            />
        </>
    )
}

export function DriverLicensePreviewModal({
    userId,
    isOpen,
    onClose,
    onOpenChange,
    imageUrl,
    onUpdated
}: BasePreviewModalProps) {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [currentUrl, setCurrentUrl] = useState<string | null>(imageUrl ?? null)

    const deleteDriverLicense = useDeleteDriverLicense({
        onSuccess: () => {
            setCurrentUrl(null)
            onUpdated?.(null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
        }
    })

    useEffect(() => {
        if (isOpen) {
            setCurrentUrl(imageUrl ?? null)
        }
    }, [imageUrl, isOpen])

    const isBusy = deleteDriverLicense.isPending

    const handleDelete = async () => {
        if (!currentUrl) return
        const confirmed = window.confirm(t("document_preview.delete_confirm"))
        if (!confirmed) return
        await deleteDriverLicense.mutateAsync(userId)
    }

    return (
        <>
            <ImagePreviewModal
                title={t("user.driver_license")}
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
                imageUrl={currentUrl ?? undefined}
                emptyMessage={t("document_preview.empty_driver_license")}
                // actionArea={null}
                footerContent={
                    <div className="flex w-full items-center justify-end gap-3">
                        <ButtonStyled
                            className="bg-danger-500 text-white"
                            onPress={handleDelete}
                            isDisabled={isBusy || !currentUrl}
                        >
                            {t("common.delete")}
                        </ButtonStyled>
                        <ButtonStyled
                            className="bg-default-200 text-gray-700"
                            onPress={onClose}
                            isDisabled={isBusy}
                        >
                            {t("common.close")}
                        </ButtonStyled>
                    </div>
                }
                isBusy={isBusy}
            />
        </>
    )
}
