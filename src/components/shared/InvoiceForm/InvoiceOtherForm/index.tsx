"use client"
import React from "react"
import { InputStyled } from "@/components"
import { Wrench, Money, ClipboardText, ArrowUDownLeft } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { InvoiceItemType, InvoiceStatus } from "@/constants/enum"
import { useTranslation } from "react-i18next"

export function InvoiceOtherForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()

    const totalOther = invoice.invoiceItems
        .filter((item) => item.type === InvoiceItemType.Other)
        .reduce((sum, item) => sum + item.subTotal, 0)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputStyled
                label={t("invoice.incident_cause")}
                value={invoice.notes}
                startContent={<Wrench size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                className="sm:col-span-2"
            />
            <InputStyled
                label={t("invoice.repair_rescue_cost")}
                value={formatCurrencyWithSymbol(totalOther)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                className="sm:col-span-2"
                isIncludeTax={true}
            />
            {invoice.status === InvoiceStatus.Paid && (
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                    <div></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputStyled
                            label={t("invoice.paid_amount")}
                            value={formatCurrencyWithSymbol(invoice.paidAmount)}
                            startContent={
                                <ClipboardText
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            label={t("invoice.return_amount")}
                            value={formatCurrencyWithSymbol(invoice.paidAmount - invoice.total)}
                            startContent={
                                <ArrowUDownLeft
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                    </div>
                </div>
            )}
            {/* <TextareaStyled
                label={t("invoice.note")}
                placeholder="Chi phí do khách hàng chịu (ngoài hợp đồng)."
                variant="bordered"
                className="sm:col-span-2"
            /> */}
        </div>
    )
}
