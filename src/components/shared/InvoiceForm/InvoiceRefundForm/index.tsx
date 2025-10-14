"use client"
import React from "react"
import { InputStyled, TextareaStyled } from "@/components"
import { Money, WarningCircle, ArrowUDownLeft } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { InvoiceItemType } from "@/constants/enum"
import { useTranslation } from "react-i18next"

export default function InvoiceRefundForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    const deposit = invoice.deposit?.amount ?? 0
    const penalty =
        invoice.invoiceItems.find((item) => item.type === InvoiceItemType.Penalty)?.subTotal ?? 0

    const total = deposit - penalty

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputStyled
                label={t("rental_contract.initial_deposit_amount")}
                value={formatCurrency(invoice.deposit?.amount ?? 0)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("rental_contract.traffic_fine_if_any")}
                value={formatCurrency(penalty)}
                startContent={<WarningCircle size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("rental_contract.total_after_deduction")}
                value={formatCurrency(total)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={
                    invoice.total <= 0
                        ? t("rental_contract.amount_customer_must_pay")
                        : t("rental_contract.amount_refunded_to_customer")
                }
                value={formatCurrency(invoice.total)}
                startContent={
                    <ArrowUDownLeft size={22} className="text-primary" weight="duotone" />
                }
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
