"use client"
import React from "react"
import { ButtonStyled, DetailDamageModal, InputStyled, TextareaStyled } from "@/components"
import { Money, Broom, Clock, Wrench } from "@phosphor-icons/react"
import { useDisclosure } from "@heroui/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { InvoiceItemType } from "@/constants/enum"
import { useTranslation } from "react-i18next"

export * from "./DetailDamage"

export function InvoiceReturnForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const clean = formatCurrency(
        invoice.invoiceItems.find((item) => item.type === InvoiceItemType.Cleaning)?.subTotal ?? 0
    )
    const lateReturn = formatCurrency(
        invoice.invoiceItems.find((item) => item.type === InvoiceItemType.LateReturn)?.subTotal ?? 0
    )

    const totalDamage = invoice.invoiceItems
        .filter((val) => val.type === InvoiceItemType.Damage)
        .reduce((sum, val) => (sum += val.subTotal), 0)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputStyled
                label={t("rental_contract.cleaning_fee")}
                value={clean}
                startContent={<Broom size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                isIncludeTax={true}
            />
            <InputStyled
                label={t("rental_contract.late_return_fee")}
                value={lateReturn}
                startContent={<Clock size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("rental_contract.damage_fee")}
                value={formatCurrency(totalDamage)}
                startContent={<Wrench size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                isIncludeTax={true}
            />
            <div className="mt-1">
                <ButtonStyled
                    onPress={onOpen}
                    size="lg"
                    variant="bordered"
                    color="primary"
                    className="px-8 py-3 hover:text-white hover:bg-primary"
                >
                    {t("rental_contract.view_damage_details")}
                </ButtonStyled>
            </div>

            <DetailDamageModal isOpen={isOpen} onOpenChange={onOpenChange} invoiceId={invoice.id} />

            <InputStyled
                label={t("rental_contract.total")}
                value={formatCurrency(invoice.total)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                className="sm:col-span-2"
            />
            <TextareaStyled
                label={t("rental_contract.note")}
                variant="bordered"
                className="sm:col-span-2"
            />
        </div>
    )
}
