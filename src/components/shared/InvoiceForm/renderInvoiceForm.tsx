import InvoiceHandOvertForm from "./InvoiceHandOverForm"
import InvoiceReturnForm from "./InvoiceReturnForm"
import InvoiceRefundForm from "./InvoiceRefundForm"
import InvoiceOtherForm from "./InvoiceOtherForm"
import React from "react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { InvoiceType } from "@/constants/enum"
import { InvoiceReservation } from "./InvoiceReservationForm"

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
