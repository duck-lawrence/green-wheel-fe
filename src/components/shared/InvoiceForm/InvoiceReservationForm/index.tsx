"use client"
import { InputStyled } from "@/components/styled"
import { InvoiceStatus } from "@/constants/enum"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { ArrowUDownLeft, ClipboardText, Money } from "@phosphor-icons/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function InvoiceReservation({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    return (
        <div className="grid grid-cols-1 gap-3">
            <InputStyled
                label={t("invoice.reservation_fee")}
                value={formatCurrencyWithSymbol(invoice.total ?? 0)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            {invoice.status === InvoiceStatus.Paid && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
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
                    </div>
                    <InputStyled
                        label={t("invoice.return_amount")}
                        value={formatCurrencyWithSymbol(invoice.paidAmount - invoice.total)}
                        startContent={
                            <ArrowUDownLeft size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                </div>
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
