"use client"
import React from "react"
import { InputStyled, TextareaStyled } from "@/components"
import { Money, ClipboardText, Receipt, Percent } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { useTranslation } from "react-i18next"
export default function InvoiceHandOvertForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputStyled
                label={t("rental_contract.deposit_amount")}
                value={
                    invoice.deposit?.amount != null ? formatCurrency(invoice.deposit.amount) : ""
                }
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("rental_contract.rental_fee")}
                value={formatCurrency(invoice.subtotal)}
                startContent={<Receipt size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("rental_contract.vat_tax")}
                value={formatCurrency(invoice.tax)}
                startContent={<Percent size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("rental_contract.total_amount")}
                value={formatCurrency(invoice.total)}
                startContent={<ClipboardText size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <TextareaStyled
                label={t("rental_contract.note")}
                value={invoice.notes}
                variant="bordered"
                className="sm:col-span-2"
            />
        </div>
    )
}
