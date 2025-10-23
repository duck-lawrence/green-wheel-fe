import { CreateInvoiceModal, ButtonStyled } from "@/components"
import { InvoiceType } from "@/constants/enum"
import { useDisclosure } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function CreateInvoiceSection({
    contractId,
    type
}: {
    contractId: string
    type: InvoiceType
}) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <ButtonStyled className="mx-2" onPress={onOpen}>
                {t("invoice.create_refund")}
            </ButtonStyled>
            <CreateInvoiceModal
                isOpen={isOpen}
                onClose={onClose}
                contractId={contractId}
                type={type}
            />
        </>
    )
}
