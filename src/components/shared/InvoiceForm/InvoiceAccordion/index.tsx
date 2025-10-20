"use client"
import React, { useCallback, useMemo, useState } from "react"
import { Accordion, AccordionItem, Chip, cn } from "@heroui/react"
import { InvoiceStatus, InvoiceType, PaymentMethod, RentalContractStatus } from "@/constants/enum"
import { InvoiceStatusLabels } from "@/constants/labels"
import { useGetMe, usePayInvoice } from "@/hooks"
import { useTranslation } from "react-i18next"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { FRONTEND_API_URL } from "@/constants/env"
import { usePathname } from "next/navigation"
import { ROLE_CUSTOMER, ROLE_STAFF } from "@/constants/constants"
import { ButtonStyled, NumberInputStyled } from "@/components"

export function InvoiceAccordion({
    className = "",
    items,
    contractStatus
}: {
    className?: string
    items: {
        key: string
        ariaLabel: string
        title: React.ReactNode
        status: InvoiceStatus
        content: React.ReactNode
        invoice: InvoiceViewRes
    }[]
    contractStatus: RentalContractStatus
}) {
    const { t } = useTranslation()
    const pathName = usePathname()
    const payInvoiceMutation = usePayInvoice()
    const [cashAmounts, setCashAmounts] = useState<Record<string, number | undefined>>({})

    const { data: user } = useGetMe()
    const { isCustomer, isStaff } = useMemo(() => {
        return {
            isCustomer: user?.role?.name === ROLE_CUSTOMER,
            isStaff: user?.role?.name === ROLE_STAFF
        }
    }, [user])

    const paymentButtons = useMemo(() => {
        const buttons = []
        if (isStaff) {
            buttons.push({ method: PaymentMethod.Cash, label: t("enum.cash") })
        }
        if (isCustomer || isStaff) {
            buttons.push({ method: PaymentMethod.MomoWallet, label: t("enum.momo_wallet") })
        }
        return buttons
    }, [isCustomer, isStaff, t])

    const isPaidable = useCallback(
        ({
            invoice,
            contractStatus
        }: {
            invoice: InvoiceViewRes
            contractStatus: RentalContractStatus
        }) => {
            const isPending = invoice.status === InvoiceStatus.Pending

            const isPaymentPendingType =
                contractStatus === RentalContractStatus.PaymentPending &&
                [InvoiceType.Handover, InvoiceType.Reservation].includes(invoice.type)

            const isActiveType =
                contractStatus === RentalContractStatus.Active &&
                [InvoiceType.Handover, InvoiceType.Return, InvoiceType.Refund].includes(
                    invoice.type
                )

            const isReturnType =
                contractStatus === RentalContractStatus.Returned &&
                [InvoiceType.Return, InvoiceType.Refund].includes(invoice.type)

            const isOtherType = invoice.type === InvoiceType.Other

            return (
                isPending && (isPaymentPendingType || isActiveType || isOtherType || isReturnType)
            )
        },
        []
    )

    const handlePayment = async ({
        id,
        paymentMethod,
        amount
    }: {
        id: string
        paymentMethod: PaymentMethod
        amount?: number
    }) => {
        await payInvoiceMutation.mutateAsync({
            invoiceId: id,
            req: {
                paymentMethod: paymentMethod,
                fallbackUrl: FRONTEND_API_URL!.concat(pathName),
                amount
            }
        })
    }

    const renderStatusChip = (status: InvoiceStatus) => {
        const colorMap = {
            [InvoiceStatus.Paid]: "success",
            [InvoiceStatus.Pending]: "warning",
            [InvoiceStatus.Cancelled]: "danger"
        } as const

        return (
            <Chip color={colorMap[status]} variant="flat" className="font-medium">
                {InvoiceStatusLabels[status]}
            </Chip>
        )
    }
    return (
        <Accordion variant="splitted" className={cn("w-full", className)}>
            {items
                .sort((a, b) => a.invoice.type - b.invoice.type)
                .map((val) => (
                    <AccordionItem
                        key={val.key}
                        aria-label={val.ariaLabel}
                        title={
                            <div className="flex justify-between items-center w-full">
                                <span className="font-semibold text-base">{val.title}</span>
                                {renderStatusChip(val.status)}
                            </div>
                        }
                    >
                        {val.content}
                        <div className="flex flex-wrap gap-2 my-2 justify-end items-center">
                            {val.invoice.total >= 0 &&
                                isPaidable({
                                    invoice: val.invoice,
                                    contractStatus: contractStatus
                                }) &&
                                paymentButtons.map((button) => (
                                    <div key={button.method} className="flex items-center gap-2">
                                        {button.method === PaymentMethod.Cash && (
                                            <NumberInputStyled
                                                label={t("rental_contract.amount")}
                                                minValue={val.invoice.total}
                                                value={cashAmounts[val.invoice.id]}
                                                onValueChange={(value) =>
                                                    setCashAmounts((prev) => ({
                                                        ...prev,
                                                        [val.invoice.id]: value
                                                    }))
                                                }
                                                labelPlacement="outside-left"
                                                className="w-50 h-10"
                                                hideStepper
                                            />
                                        )}
                                        <ButtonStyled
                                            onPress={() =>
                                                handlePayment({
                                                    id: val.invoice.id,
                                                    paymentMethod: button.method,
                                                    amount:
                                                        button.method === PaymentMethod.Cash
                                                            ? cashAmounts[val.invoice.id]
                                                            : undefined
                                                })
                                            }
                                            size="md"
                                            color="primary"
                                            className="btn-gradient px-6 py-3"
                                        >
                                            {t("car_rental.pay")} {button.label}
                                        </ButtonStyled>
                                    </div>
                                ))}
                        </div>
                    </AccordionItem>
                ))}
        </Accordion>
    )
}
