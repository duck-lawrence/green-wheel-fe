"use client"
import { DetailDamage, ModalStyled } from "@/components"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { ModalBody, ModalContent, ModalHeader } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function DetailDamageModal({
    isOpen,
    onOpenChange,
    itemDamage
}: {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    itemDamage: InvoiceViewRes
}) {
    const { t } = useTranslation()

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    {t("rental_contract.damage_details")}
                </ModalHeader>
                <ModalBody>
                    <DetailDamage invoice={itemDamage} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
