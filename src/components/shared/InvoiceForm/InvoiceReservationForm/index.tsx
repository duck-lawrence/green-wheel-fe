"use client"
import { InputStyled } from "@/components/styled"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { Money } from "@phosphor-icons/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function InvoiceReservation({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    return (
        <div>
            <InputStyled
                label={t("rental_contract.reservation_fee")}
                value={formatCurrency(invoice.total ?? 0)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
        </div>
    )
}
