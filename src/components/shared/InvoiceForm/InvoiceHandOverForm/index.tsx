"use client"
import React from "react"
import { InputStyled } from "@/components"
import { Money, ClipboardText, Receipt, Percent, ArrowUDownLeft } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { useTranslation } from "react-i18next"
import { InvoiceStatus } from "@/constants/enum"

export function InvoiceHandOvertForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputStyled
                label={t("invoice.rental_fee")}
                value={formatCurrency(invoice.subtotal)}
                startContent={<Receipt size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                isIncludeTax={true}
            />
            <InputStyled
                label={t("invoice.deposit_amount")}
                value={
                    invoice.deposit?.amount != null ? formatCurrency(invoice.deposit.amount) : ""
                }
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("invoice.vat_tax")}
                value={formatCurrency(invoice.tax)}
                startContent={<Percent size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            <InputStyled
                label={t("invoice.total")}
                value={formatCurrency(invoice.total)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />

            {invoice.status === InvoiceStatus.Paid && (
                <>
                    <div></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputStyled
                            label={t("invoice.paid_amount")}
                            value={formatCurrency(invoice.paidAmount)}
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
                            value={formatCurrency(invoice.paidAmount - invoice.total)}
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
                </>
            )}
            {/* <TextareaStyled
                label={t("invoice.note")}
                value={invoice.notes}
                variant="bordered"
                className="sm:col-span-2"
            /> */}
        </div>
    )
}
