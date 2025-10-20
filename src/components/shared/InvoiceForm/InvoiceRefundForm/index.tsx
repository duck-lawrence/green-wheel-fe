"use client"
import React, { useMemo } from "react"
import { InputStyled, TableStyled, TextareaStyled } from "@/components"
import { Money, WarningCircle, ArrowUDownLeft } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { useTranslation } from "react-i18next"
import { AlertStyled } from "@/components"
import { InvoiceItemType } from "@/constants/enum"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { InvoiceItemTypeLabels } from "@/constants/labels"

export function InvoiceRefundForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()

    const refundItem = useMemo(() => {
        return invoice.invoiceItems.find((item) => item.type === InvoiceItemType.Refund)
    }, [invoice.invoiceItems])
    const penaltyItems = useMemo(
        () => invoice.invoiceItems.filter((item) => item.type === InvoiceItemType.Penalty) || [],
        [invoice.invoiceItems]
    )

    return (
        <>
            <AlertStyled color="warning" className="mb-3 mt-[-0.75rem] max-w-fit italic">
                {t("rental_contract.penalty_warning")}
            </AlertStyled>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {/* Deposit */}
                <InputStyled
                    label={t("rental_contract.initial_deposit_amount")}
                    value={formatCurrency(refundItem?.subTotal ?? 0)}
                    startContent={<Money size={22} className="text-primary" weight="duotone" />}
                    variant="bordered"
                />

                {/* Penalty subtotal */}
                <InputStyled
                    label={t("rental_contract.penalty_total")}
                    value={formatCurrency(invoice.subtotal)}
                    startContent={
                        <WarningCircle size={22} className="text-primary" weight="duotone" />
                    }
                    variant="bordered"
                />

                <InputStyled
                    label={
                        invoice.total >= 0
                            ? t("rental_contract.amount_customer_must_pay")
                            : t("rental_contract.amount_refunded_to_customer")
                    }
                    value={formatCurrency(invoice.total)}
                    startContent={
                        <ArrowUDownLeft size={22} className="text-primary" weight="duotone" />
                    }
                    variant="bordered"
                />
            </div>
            {penaltyItems && (
                <TableStyled className="min-w-full text-sm md:text-base mb-3" removeWrapper>
                    <TableHeader>
                        <TableColumn className="text-center text-gray-700 font-semibold w-12">
                            {t("table.no")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold w-50">
                            {t("table.description")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold w-12">
                            {t("table.type")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold w-12">
                            {t("invoice.unit_price")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold w-12">
                            {t("invoice.quantity")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold w-12">
                            {t("invoice.subtotal")}
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {penaltyItems.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-center align-top text-gray-700">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="text-center align-top text-gray-700">
                                    {item.description || ""}
                                </TableCell>
                                <TableCell className="text-center align-top text-gray-700">
                                    {InvoiceItemTypeLabels[item.type]}
                                </TableCell>
                                <TableCell className="text-center align-top text-gray-700">
                                    {formatCurrency(item.unitPrice)}
                                </TableCell>
                                <TableCell className="text-center align-top text-gray-700">
                                    {formatCurrency(item.quantity)}
                                </TableCell>
                                <TableCell className="text-center align-top text-gray-700">
                                    {formatCurrency(item.subTotal)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableStyled>
            )}
            <TextareaStyled
                label={t("rental_contract.note")}
                value={invoice.notes}
                variant="bordered"
                className="sm:col-span-2"
            />
        </>
    )
}
