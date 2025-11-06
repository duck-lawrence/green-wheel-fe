"use client"
import React, { useCallback, useMemo, useState } from "react"
import { Accordion, AccordionItem, Chip, cn } from "@heroui/react"
import {
    InvoiceStatus,
    InvoiceType,
    PaymentMethod,
    RentalContractStatus,
    RoleName
} from "@/constants/enum"
import { InvoiceStatusLabels, PaymentMethodLabels } from "@/constants/labels"
import { useGetMe, usePayInvoice } from "@/hooks"
import { useTranslation } from "react-i18next"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { FRONTEND_API_URL } from "@/constants/env"
import { usePathname } from "next/navigation"
import { AlertStyled, ButtonStyled, InvoiceUploader, NumberInputStyled } from "@/components"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"

export function InvoiceAccordion({
    className = "",
    items,
    contractId,
    contractStatus,
    returnChecklist
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
    contractId: string
    contractStatus: RentalContractStatus
    returnChecklist?: VehicleChecklistViewRes
}) {
    const { t } = useTranslation()
    const pathName = usePathname()
    const payInvoiceMutation = usePayInvoice({ contractId })
    const [cashAmounts, setCashAmounts] = useState<Record<string, number | undefined>>({})

    const { data: user } = useGetMe()
    const { isCustomer, isStaff } = useMemo(() => {
        return {
            isCustomer: user?.role?.name === RoleName.Customer,
            isStaff: user?.role?.name === RoleName.Staff
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

    const refundInvoice = useMemo(() => {
        return items.find((item) => item.invoice.type === InvoiceType.Refund)?.invoice
    }, [items])

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
                returnChecklist &&
                returnChecklist.isSignedByCustomer &&
                returnChecklist.isSignedByStaff &&
                [InvoiceType.Return, InvoiceType.Refund].includes(invoice.type)

            const isRefundPendingType =
                contractStatus === RentalContractStatus.RefundPending &&
                [InvoiceType.Refund].includes(invoice.type)

            const isOtherType = invoice.type === InvoiceType.Other

            return (
                isPending &&
                invoice.total > 0 &&
                (isPaymentPendingType ||
                    isActiveType ||
                    isReturnType ||
                    isRefundPendingType ||
                    isOtherType)
            )
        },
        [returnChecklist]
    )

    const isRefundUpload = useCallback((invoice: InvoiceViewRes) => {
        return !invoice.imageUrl && invoice.type === InvoiceType.Refund && invoice.total < 0
    }, [])

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
            id: id,
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
        <div>
            <Accordion key={t("invoice.policy_title")} variant="splitted" className="w-full">
                <AccordionItem
                    title={t("invoice.policy_title")}
                    subtitle={t("invoice.policy_subtitle")}
                    className="whitespace-break-spaces"
                >
                    <AlertStyled className="mt-[-0.75rem] mb-1 mx-2">
                        {t("invoice.fees_include_tax")}
                    </AlertStyled>
                    <AlertStyled className="whitespace-break-spaces mb-1 mx-2">
                        {t("invoice.reservation_fee_deduction")}
                    </AlertStyled>
                    <AlertStyled color="warning" className="mb-3 mx-2">
                        {t("invoice.penalty_warning")}
                    </AlertStyled>
                </AccordionItem>
            </Accordion>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {items
                    .sort((a, b) => a.invoice.type - b.invoice.type)
                    .map((val) => (
                        <Accordion
                            key={val.key}
                            variant="splitted"
                            className={cn("w-full", className)}
                        >
                            <AccordionItem
                                key={val.key}
                                aria-label={val.ariaLabel}
                                className="w-full"
                                title={
                                    <div className="flex justify-between items-center ">
                                        <span className="font-semibold text-base">
                                            {val.title}
                                            {isCustomer &&
                                                refundInvoice &&
                                                val.invoice.id === refundInvoice.id &&
                                                refundInvoice.status !== InvoiceStatus.Paid &&
                                                refundInvoice.total < 0 && (
                                                    <span className="text-sm font-normal">{` | ${t(
                                                        "invoice.visit_station_to_get_refund"
                                                    )}`}</span>
                                                )}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {renderStatusChip(val.status)}
                                            {val.invoice.paymentMethod !== undefined &&
                                                val.invoice.status === InvoiceStatus.Paid && (
                                                    <Chip color="primary" variant="bordered">
                                                        {
                                                            PaymentMethodLabels[
                                                                val.invoice.paymentMethod
                                                            ]
                                                        }
                                                    </Chip>
                                                )}
                                        </div>
                                    </div>
                                }
                            >
                                {val.content}
                                <div className="flex flex-wrap gap-2 my-2 justify-end items-center">
                                    {isPaidable({
                                        invoice: val.invoice,
                                        contractStatus: contractStatus
                                    }) &&
                                        paymentButtons.map((button) => {
                                            const paidAmount = cashAmounts[val.invoice.id]
                                            return (
                                                <div
                                                    key={button.method}
                                                    className="flex items-center gap-2"
                                                >
                                                    {button.method === PaymentMethod.Cash && (
                                                        <NumberInputStyled
                                                            label={t("invoice.amount")}
                                                            minValue={val.invoice.total}
                                                            value={paidAmount}
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
                                                        isDisabled={
                                                            (paidAmount !== undefined &&
                                                                paidAmount < val.invoice.total) ||
                                                            payInvoiceMutation.isPending
                                                        }
                                                        onPress={() =>
                                                            handlePayment({
                                                                id: val.invoice.id,
                                                                paymentMethod: button.method,
                                                                amount:
                                                                    button.method ===
                                                                    PaymentMethod.Cash
                                                                        ? cashAmounts[
                                                                              val.invoice.id
                                                                          ]
                                                                        : undefined
                                                            })
                                                        }
                                                        size="md"
                                                        color="primary"
                                                        className="btn-gradient px-6 py-3"
                                                    >
                                                        {button.label}
                                                    </ButtonStyled>
                                                </div>
                                            )
                                        })}
                                    {isStaff && isRefundUpload(val.invoice) && (
                                        <InvoiceUploader
                                            id={val.invoice.id}
                                            contractId={contractId}
                                        />
                                    )}
                                </div>
                            </AccordionItem>
                        </Accordion>
                    ))}
            </div>

            {/* {isCustomer &&
                    refundInvoice &&
                    refundInvoice.status !== InvoiceStatus.Paid &&
                    refundInvoice.total < 0 && (
                        <AlertStyled color="default" hideIcon>
                            {t("invoice.visit_station_to_get_refund")}
                        </AlertStyled>
                    )} */}
            {/* <Accordion variant="splitted" className={cn("w-full", className)}>
                {items
                    .sort((a, b) => a.invoice.type - b.invoice.type)
                    .map((val) => (
                        <AccordionItem
                            key={val.key}
                            aria-label={val.ariaLabel}
                            title={
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-semibold text-base">
                                        {val.title}
                                        {isCustomer &&
                                            refundInvoice &&
                                            val.invoice.id === refundInvoice.id &&
                                            refundInvoice.status !== InvoiceStatus.Paid &&
                                            refundInvoice.total < 0 && (
                                                <span className="text-sm font-normal">{` | ${t(
                                                    "invoice.visit_station_to_get_refund"
                                                )}`}</span>
                                            )}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {renderStatusChip(val.status)}
                                        {val.invoice.paymentMethod !== undefined &&
                                            val.invoice.status === InvoiceStatus.Paid && (
                                                <Chip color="primary" variant="bordered">
                                                    {PaymentMethodLabels[val.invoice.paymentMethod]}
                                                </Chip>
                                            )}
                                    </div>
                                </div>
                            }
                        >
                            {val.content}
                            <div className="flex flex-wrap gap-2 my-2 justify-end items-center">
                                {isPaidable({
                                    invoice: val.invoice,
                                    contractStatus: contractStatus
                                }) &&
                                    paymentButtons.map((button) => {
                                        const paidAmount = cashAmounts[val.invoice.id]
                                        return (
                                            <div
                                                key={button.method}
                                                className="flex items-center gap-2"
                                            >
                                                {button.method === PaymentMethod.Cash && (
                                                    <NumberInputStyled
                                                        label={t("invoice.amount")}
                                                        minValue={val.invoice.total}
                                                        value={paidAmount}
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
                                                    isDisabled={
                                                        (paidAmount !== undefined &&
                                                            paidAmount < val.invoice.total) ||
                                                        payInvoiceMutation.isPending
                                                    }
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
                                                    {payInvoiceMutation.isPending ? (
                                                        <Spinner color="white" />
                                                    ) : (
                                                        button.label
                                                    )}
                                                </ButtonStyled>
                                            </div>
                                        )
                                    })}
                                {isStaff && isRefundUpload(val.invoice) && (
                                    <InvoiceUploader id={val.invoice.id} contractId={contractId} />
                                )}
                            </div>
                        </AccordionItem>
                    ))}
            </Accordion> */}
        </div>
    )
}
