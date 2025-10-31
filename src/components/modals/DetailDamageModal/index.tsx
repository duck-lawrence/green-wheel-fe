"use client"
import { DetailDamage, ModalStyled } from "@/components"
import { useGetInvoiceById } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
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
            toast.error(translateWithFallback(t, backendErr.detail))
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
