"use client"
import React from "react"
import { InputStyled, TextareaStyled } from "@/components"
import { Wrench, Money } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { InvoiceItemType } from "@/constants/enum"
import { useTranslation } from "react-i18next"

export default function InvoiceOtherForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()

    const totalOther = invoice.invoiceItems
        .filter((item) => item.type === InvoiceItemType.Other)
        .reduce((sum, item) => sum + item.subTotal, 0)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputStyled
                label={t("rental_contract.incident_cause")}
                value={invoice.notes}
                startContent={<Wrench size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                className="sm:col-span-2"
            />
            <InputStyled
                label={t("rental_contract.repair_rescue_cost")}
                value={formatCurrency(totalOther)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                className="sm:col-span-2"
                isIncludeTax={true}
            />
            <TextareaStyled
                label={t("rental_contract.note")}
                placeholder="Chi phí do khách hàng chịu (ngoài hợp đồng)."
                variant="bordered"
                className="sm:col-span-2"
            />
        </div>
    )
}
