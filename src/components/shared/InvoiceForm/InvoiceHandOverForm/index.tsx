"use client"
import React from "react"
import { InputStyled } from "@/components"
import { Money, ClipboardText, Receipt, ArrowUDownLeft } from "@phosphor-icons/react"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { useTranslation } from "react-i18next"
import { InvoiceStatus } from "@/constants/enum"
import { TaxInput } from "../TaxInput"

// export function InvoiceHandOvertForm({ invoice }: { invoice: InvoiceViewRes }) {
//     const { t } = useTranslation()
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <InputStyled
//                 label={t("invoice.rental_fee")}
//                 value={formatCurrencyWithSymbol(invoice.subtotal)}
//                 startContent={<Receipt size={22} className="text-primary" weight="duotone" />}
//                 variant="bordered"
//                 isIncludeTax={true}
//             />
//             <InputStyled
//                 label={t("invoice.deposit_amount")}
//                 value={
//                     invoice.deposit?.amount != null
//                         ? formatCurrencyWithSymbol(invoice.deposit.amount)
//                         : ""
//                 }
//                 startContent={<Money size={22} className="text-primary" weight="duotone" />}
//                 variant="bordered"
//             />
//             <div className="flex gap-3">
//                 <TaxInput invoice={invoice} />
//                 <InputStyled
//                     label={t("invoice.total")}
//                     value={formatCurrencyWithSymbol(invoice.total)}
//                     startContent={<Money size={22} className="text-primary" weight="duotone" />}
//                     variant="bordered"
//                 />
//             </div>

//             {invoice.status === InvoiceStatus.Paid && (
//                 <>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                         <InputStyled
//                             label={t("invoice.paid_amount")}
//                             value={formatCurrencyWithSymbol(invoice.paidAmount)}
//                             startContent={
//                                 <ClipboardText
//                                     size={22}
//                                     className="text-primary"
//                                     weight="duotone"
//                                 />
//                             }
//                             variant="bordered"
//                         />
//                         <InputStyled
//                             label={t("invoice.return_amount")}
//                             value={formatCurrencyWithSymbol(invoice.paidAmount - invoice.total)}
//                             startContent={
//                                 <ArrowUDownLeft
//                                     size={22}
//                                     className="text-primary"
//                                     weight="duotone"
//                                 />
//                             }
//                             variant="bordered"
//                         />
//                     </div>
//                 </>
//             )}
//             {/* <TextareaStyled
//                 label={t("invoice.note")}
//                 value={invoice.notes}
//                 variant="bordered"
//                 className="sm:col-span-2"
//             /> */}
//         </div>
//     )
// }

export function InvoiceHandOvertForm({ invoice }: { invoice: InvoiceViewRes }) {
    const { t } = useTranslation()
    return (
        <div className="grid   gap-3">
            <div className="flex flex-col gap-3">
                <InputStyled
                    label={t("invoice.rental_fee")}
                    value={formatCurrencyWithSymbol(invoice.subtotal)}
                    startContent={<Receipt size={22} className="text-primary" weight="duotone" />}
                    variant="bordered"
                    isIncludeTax={true}
                />
                <InputStyled
                    label={t("invoice.deposit_amount")}
                    value={
                        invoice.deposit?.amount != null
                            ? formatCurrencyWithSymbol(invoice.deposit.amount)
                            : ""
                    }
                    startContent={<Money size={22} className="text-primary" weight="duotone" />}
                    variant="bordered"
                />
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3">
                    <div className="md:col-span-2 sm:col-span-1">
                        <InputStyled
                            label={t("invoice.deposit_amount")}
                            value={formatCurrencyWithSymbol(invoice.tax * invoice.subtotal)}
                            startContent={
                                <Money size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                        />
                    </div>

                    <TaxInput invoice={invoice} />
                </div>

                <InputStyled
                    label={t("invoice.total")}
                    value={formatCurrencyWithSymbol(invoice.total)}
                    startContent={<Money size={22} className="text-primary" weight="duotone" />}
                    variant="bordered"
                />
                {invoice.status === InvoiceStatus.Paid && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputStyled
                                label={t("invoice.paid_amount")}
                                value={formatCurrencyWithSymbol(invoice.paidAmount)}
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
                                value={formatCurrencyWithSymbol(invoice.paidAmount - invoice.total)}
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
                    </>
                )}
            </div>

            {/* <TextareaStyled
                label={t("invoice.note")}
                value={invoice.notes}
                variant="bordered"
                className="sm:col-span-2"
            /> */}
        </div>
    )
}
