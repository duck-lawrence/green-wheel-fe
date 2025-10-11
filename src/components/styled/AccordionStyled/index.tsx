"use client"
import React from "react"
import { Accordion, AccordionItem, Chip } from "@heroui/react"
import { InvoiceStatus } from "@/constants/enum"
import { InvoiceStatusLabels } from "@/constants/labels"
import { ButtonStyled } from "../ButtonStyled"
import { usePayInvoice } from "@/hooks/queries/usePayInvoice"
import { useTranslation } from "react-i18next"
import { InvoiceViewRes } from "@/models/invoice/schema/response"

export function AccordionStyled({
    items
}: {
    items: {
        key: string
        ariaLabel: string
        title: React.ReactNode
        status: InvoiceStatus
        content: React.ReactNode
        invoice: InvoiceViewRes
    }[]
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

    const { t } = useTranslation()
    const payInvoiceMutation = usePayInvoice()

    const handlePayment = async (invoiceId: string) => {
        await payInvoiceMutation.mutateAsync(invoiceId)
    }

    return (
        <Accordion variant="splitted" className="w-full">
            {items.map((val) => (
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
                    <div className="flex justify-end items-center gap-2 p-2">
                        <div className="mt-0 flex justify-center">
                            <ButtonStyled
                                isDisabled={
                                    val.invoice.total <= 0 || val.status !== InvoiceStatus.Pending
                                        ? false
                                        : true
                                }
                                onPress={() => handlePayment(val.invoice.id)}
                                size="lg"
                                color="primary"
                                className="px-12 py-3 font-semibold text-white rounded-xl 
                                           bg-gradient-to-r from-primary to-teal-400 
                                           hover:from-teal-500 hover:to-green-400 
                                           shadow-md transition-all duration-300"
                            >
                                Payment
                            </ButtonStyled>
                        </div>
                    </div>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
