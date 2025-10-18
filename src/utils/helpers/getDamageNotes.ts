import { InvoiceItemType } from "@/constants/enum"
import { InvoiceViewRes } from "@/models/invoice/schema/response"

export const getDamageNotes = (invoice: InvoiceViewRes): string => {
    const notes = invoice.invoiceItems
        .filter((value) => value.type === InvoiceItemType.Damage && value.checklistItem?.notes)
        .map((value) => `• ${value.checklistItem!.notes}`)
        .join("\n")
    return notes || "Không có phí thiệt hại nào."
}

export const getOtherNotes = (invoice: InvoiceViewRes): string => {
    const notes = invoice.invoiceItems
        .filter((value) => value.type === InvoiceItemType.Other && value.checklistItem?.notes)
        .map((value) => `• ${value.checklistItem!.notes}`)
        .join("\n")
    return notes || "Không có phí thiệt hại nào."
}
