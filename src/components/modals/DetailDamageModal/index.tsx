"use client"
import { DetailDamage, ModalStyled } from "@/components"
import { useGetInvoiceById } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

export function DetailDamageModal({
    isOpen,
    onOpenChange,
    invoiceId
}: {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    invoiceId: string
}) {
    const { t } = useTranslation()
    const { data: invoice, isLoading, error } = useGetInvoiceById({ id: invoiceId })

    useEffect(() => {
        if (error) {
            const backendErr = error as BackendError
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, backendErr.detail),
                color: "danger"
            })
        }
    }, [error, t])

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    {t("invoice.damage_details")}
                </ModalHeader>
                <ModalBody>
                    {!invoice || isLoading ? (
                        <Spinner />
                    ) : (
                        <DetailDamage invoiceItems={invoice.invoiceItems} />
                    )}
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
