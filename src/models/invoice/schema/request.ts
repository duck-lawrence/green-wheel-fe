import { InvoiceItemType, InvoiceType, PaymentMethod } from "@/constants/enum"

export type PaymentReq = {
    paymentMethod: PaymentMethod
    fallbackUrl: string
    amount?: number
}

export type CreateInvoiceReq = {
    contractId: string
    type: InvoiceType
    items: CreateInvoiceItemReq[]
}

export type CreateInvoiceItemReq = {
    unitPrice: number
    quantity: number
    description?: string
    type: InvoiceItemType
}
