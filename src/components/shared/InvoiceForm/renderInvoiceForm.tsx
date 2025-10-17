import React from "react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { InvoiceType } from "@/constants/enum"
import {
    InvoiceHandOvertForm,
    InvoiceOtherForm,
    InvoiceRefundForm,
    InvoiceReservation,
    InvoiceReturnForm
} from "@/components"

export const renderInvoiceForm = (invoice: InvoiceViewRes) => {
    switch (invoice.type) {
        case InvoiceType.Reservation:
            return <InvoiceReservation invoice={invoice} />
        case InvoiceType.Handover:
            return <InvoiceHandOvertForm invoice={invoice} />
        case InvoiceType.Return:
            return <InvoiceReturnForm invoice={invoice} />
        case InvoiceType.Refund:
            return <InvoiceRefundForm invoice={invoice} />
        case InvoiceType.Other:
            return <InvoiceOtherForm invoice={invoice} />
        default:
            return null
    }
}
