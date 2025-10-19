"use client"
import React, { useCallback, useMemo } from "react"
import { Accordion, AccordionItem, Chip, cn } from "@heroui/react"
import { InvoiceStatus, InvoiceType, PaymentMethod, RentalContractStatus } from "@/constants/enum"
import { InvoiceStatusLabels } from "@/constants/labels"
import { useGetMe, usePayInvoice } from "@/hooks"
import { useTranslation } from "react-i18next"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { FRONTEND_API_URL } from "@/constants/env"
import { usePathname } from "next/navigation"
import { ROLE_CUSTOMER } from "@/constants/constants"
import { ButtonStyled } from "@/components"

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
    // const renderStatusChip = (status: InvoiceStatus) => {
    //     switch (status) {
    //         case InvoiceStatus.Paid:
    //             return (
    //                 <Chip color="success" variant="flat" className="font-medium">
    //                     {InvoiceStatusLabels[status]}
    //                 </Chip>
    //             )
    //         case InvoiceStatus.Pending:
    //             return (
    //                 <Chip color="warning" variant="flat" className="font-medium">
    //                     {InvoiceStatusLabels[status]}
    //                 </Chip>
    //             )
    //         case InvoiceStatus.Cancelled:
    //             return (
    //                 <Chip color="danger" variant="flat" className="font-medium">
    //                     {InvoiceStatusLabels[status]}
    //                 </Chip>
    //             )
    //         default:
    //             return null
    //     }
    // }

    const { t } = useTranslation()
    const pathName = usePathname()
    const payInvoiceMutation = usePayInvoice()

    const { data: user } = useGetMe()
    const isCustomer = useMemo(() => {
        return user?.role?.name === ROLE_CUSTOMER
    }, [user])

    const isPaidable = useCallback(
        ({
            invoice,
            contractStatus
        }: {
            invoice: InvoiceViewRes
            contractStatus: RentalContractStatus
        }) => {
            if (!isCustomer) return false

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
        [isCustomer]
    )

    const handlePayment = async (invoiceId: string) => {
        await payInvoiceMutation.mutateAsync({
            invoiceId: invoiceId,
            req: {
                paymentMethod: PaymentMethod.MomoWallet,
                fallbackUrl: FRONTEND_API_URL!.concat(pathName)
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
                        {val.invoice.total >= 0 &&
                            isPaidable({
                                invoice: val.invoice,
                                contractStatus: contractStatus
                            }) && (
                                <div className="flex justify-end items-center gap-2 p-2">
                                    <div className="mt-0 flex justify-center">
                                        <ButtonStyled
                                            onPress={() => handlePayment(val.invoice.id)}
                                            size="lg"
                                            color="primary"
                                            className="btn-gradient px-12 py-3"
                                        >
                                            {t("enum.payment")}
                                        </ButtonStyled>
                                    </div>
                                </div>
                            )}
                    </AccordionItem>
                ))}
        </Accordion>
    )
}
