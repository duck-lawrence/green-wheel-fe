"use client"

import { InputStyled } from "@/components/styled"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { Percent } from "@phosphor-icons/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function TaxInput({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()

    return (
        <InputStyled
            label={t("invoice.vat_tax")}
            value={`${invoice.tax * 100}%`}
            startContent={<Percent size={22} className="text-primary" weight="duotone" />}
            variant="bordered"
        />
    )
}
