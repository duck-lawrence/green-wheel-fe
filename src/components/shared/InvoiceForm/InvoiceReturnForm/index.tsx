"use client"
import React from "react"
import { ButtonStyled, InputStyled, TextareaStyled } from "@/components"
import { Money, Broom, Clock, Wrench } from "@phosphor-icons/react"
import { useDisclosure } from "@heroui/react"
import SeeDetailDamageModal from "@/components/modals/SeeDetailDamageModel"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { InvoiceItemType } from "@/constants/enum"
import { useTranslation } from "react-i18next"

export default function InvoiceReturnForm({ invoice }: { invoice: InvoiceViewRes }) {
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
            />
            <div className="mt-1 flex justify-center">
                <ButtonStyled
                    onPress={onOpen}
                    size="lg"
                    color="primary"
                    className="px-8 py-3 font-semibold text-white rounded-xl 
              bg-gradient-to-r from-primary to-teal-400 
              hover:from-teal-500 hover:to-green-400 
              shadow-md transition-all duration-300"
                >
                    {t("rental_contract.view_damage_details")}
                </ButtonStyled>
            </div>

            <SeeDetailDamageModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                itemDamage={invoice}
            />

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
