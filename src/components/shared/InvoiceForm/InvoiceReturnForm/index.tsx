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
import { formatCurrency } from "@/utils/helpers/currency"
import { InvoiceItemType, InvoiceStatus } from "@/constants/enum"
import { useTranslation } from "react-i18next"

export * from "./DetailDamage"

export function InvoiceReturnForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const clean = formatCurrency(
        invoice.invoiceItems.find((item) => item.type === InvoiceItemType.Cleaning)?.subTotal ?? 0
    )
    const lateReturn = formatCurrency(
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
                    value={formatCurrency(totalDamage)}
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

            <InputStyled
                label={t("invoice.total")}
                value={formatCurrency(invoice.total)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
            {invoice.status === InvoiceStatus.Paid && (
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
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
                </div>
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
