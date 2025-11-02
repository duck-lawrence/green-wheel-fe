"use client"
import React from "react"
import { ButtonIconStyled, DetailDamageModal, InputStyled } from "@/components"
import {
    Money,
    Broom,
    Clock,
    Wrench,
    EyeIcon,
    ClipboardText,
    ArrowUDownLeft
} from "@phosphor-icons/react"
import { useDisclosure } from "@heroui/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { InvoiceItemType, InvoiceStatus } from "@/constants/enum"
import { useTranslation } from "react-i18next"
import { TaxInput } from "../TaxInput"

export * from "./DetailDamage"

export function InvoiceReturnForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const clean = formatCurrencyWithSymbol(
        invoice.invoiceItems.find((item) => item.type === InvoiceItemType.Cleaning)?.subTotal ?? 0
    )
    const lateReturn = formatCurrencyWithSymbol(
        invoice.invoiceItems.find((item) => item.type === InvoiceItemType.LateReturn)?.subTotal ?? 0
    )

    const totalDamage = invoice.invoiceItems
        .filter((val) => val.type === InvoiceItemType.Damage)
        .reduce((sum, val) => (sum += val.subTotal), 0)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputStyled
                label={t("invoice.cleaning_fee")}
                value={clean}
                startContent={<Broom size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
                isIncludeTax={true}
            />
            <InputStyled
                label={t("invoice.late_return_fee")}
                value={lateReturn}
                startContent={<Clock size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />

            <div className="flex gap-3 items-center">
                <InputStyled
                    label={t("invoice.damage_fee")}
                    value={formatCurrencyWithSymbol(totalDamage)}
                    startContent={<Wrench size={22} className="text-primary" weight="duotone" />}
                    variant="bordered"
                    isIncludeTax={true}
                />
                <ButtonIconStyled
                    onPress={onOpen}
                    size="lg"
                    variant="ghost"
                    color="primary"
                    className="min-w-fit"
                >
                    <EyeIcon size={24} />
                </ButtonIconStyled>
            </div>

            <DetailDamageModal isOpen={isOpen} onOpenChange={onOpenChange} invoiceId={invoice.id} />

            <div className="flex gap-3">
                <TaxInput invoice={invoice} />
                <InputStyled
                    label={t("invoice.total")}
                    value={formatCurrencyWithSymbol(invoice.total)}
                    startContent={<Money size={22} className="text-primary" weight="duotone" />}
                    variant="bordered"
                />
            </div>
            {invoice.status === InvoiceStatus.Paid && (
                <>
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
                </>
            )}
            {/* <TextareaStyled
                label={t("invoice.note")}
                value={invoice.notes || ""}
                variant="bordered"
                className="sm:col-span-2"
            /> */}
        </div>
    )
}
