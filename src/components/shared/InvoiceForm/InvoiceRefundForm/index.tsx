"use client"
import React, { useMemo } from "react"
import { ImageStyled, InputStyled, SectionStyled } from "@/components"
import {
    Money,
    WarningCircle,
    ArrowUDownLeft,
    ClipboardText,
    NotePencilIcon
} from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { useTranslation } from "react-i18next"
import { AlertStyled } from "@/components"
import { InvoiceItemType, InvoiceStatus } from "@/constants/enum"
import { InvoiceItemTypeLabels } from "@/constants/labels"
import { ReceiptText } from "lucide-react"

export function InvoiceRefundForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()

    const refundItem = useMemo(() => {
        return invoice.invoiceItems.find((item) => item.type === InvoiceItemType.Refund)
    }, [invoice.invoiceItems])
    const penaltyItems = useMemo(
        () => invoice.invoiceItems.filter((item) => item.type === InvoiceItemType.Penalty) || [],
        [invoice.invoiceItems]
    )

    const hasImage = !!invoice.imageUrl

    return (
        <div className="grid grid-cols-1 space-y-3 sm:grid-cols-4 sm:gap-3">
            {invoice.imageUrl && (
                <ImageStyled
                    src={invoice.imageUrl}
                    alt={t("invoice.image")}
                    width={240}
                    height={320}
                />
            )}
            <div className={`${hasImage ? "col-span-3" : "col-span-4"}`}>
                {invoice.status !== InvoiceStatus.Paid && invoice.total >= 0 && (
                    <AlertStyled color="warning" className="mb-3 mt-[-0.75rem] max-w-fit">
                        {t("invoice.penalty_warning")}
                    </AlertStyled>
                )}
                <div className={`grid grid-cols-1 ${hasImage ? "col-span-3" : ""} gap-3 mb-3`}>
                    {/* Deposit */}
                    <InputStyled
                        label={t("invoice.initial_deposit_amount")}
                        value={formatCurrencyWithSymbol(refundItem?.subTotal ?? 0)}
                        startContent={<Money size={22} className="text-primary" weight="duotone" />}
                        variant="bordered"
                    />

                    {/* ===============Total pennalty================= */}
                    <SectionStyled title="Penalty" icon={ReceiptText} sectionClassName="mb-0">
                        {penaltyItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 gap-3">
                                <InputStyled
                                    key={index}
                                    label={InvoiceItemTypeLabels[item.type]}
                                    value={formatCurrencyWithSymbol(item.subTotal)}
                                    startContent={
                                        <Money
                                            size={22}
                                            className="text-primary"
                                            weight="duotone"
                                        />
                                    }
                                    variant="bordered"
                                />
                                <div className="col-span-2">
                                    <InputStyled
                                        key={index}
                                        label={t("table.description")}
                                        value={item.description || ""}
                                        startContent={
                                            <NotePencilIcon
                                                size={22}
                                                className="text-primary"
                                                weight="duotone"
                                            />
                                        }
                                        variant="bordered"
                                    />
                                </div>
                            </div>
                        ))}
                    </SectionStyled>
                    {/* ===============Total pennalty================= */}

                    <hr className="text-gray-400 border-2 rounded-2xl " />
                    {/* Penalty subtotal */}
                    <InputStyled
                        label={t("invoice.penalty_total")}
                        value={formatCurrencyWithSymbol(invoice.subtotal)}
                        startContent={
                            <WarningCircle size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />

                    <InputStyled
                        label={
                            invoice.total >= 0
                                ? t("invoice.amount_customer_must_pay")
                                : t("invoice.amount_refunded_to_customer")
                        }
                        value={formatCurrencyWithSymbol(invoice.total)}
                        startContent={
                            <ArrowUDownLeft size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                </div>
                {invoice.status === InvoiceStatus.Paid && invoice.total >= 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
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
            </div>
        </div>
    )
}
