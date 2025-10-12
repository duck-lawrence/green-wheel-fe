import { InputStyled } from "@/components/styled"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import { Money } from "@phosphor-icons/react"
import React from "react"

export function InvoiceReservation({ invoice }: { invoice: InvoiceViewRes }) {
    return (
        <div>
            <InputStyled
                label="Số tiền giữ chỗ"
                value={formatCurrency(invoice.deposit?.amount ?? 0)}
                startContent={<Money size={22} className="text-primary" weight="duotone" />}
                variant="bordered"
            />
        </div>
    )
}
