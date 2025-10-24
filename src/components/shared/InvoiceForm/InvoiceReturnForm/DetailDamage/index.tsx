"use client"

import { InvoiceItemViewRes } from "@/models/invoice/schema/response"
import { InvoiceItemType } from "@/constants/enum"
import React from "react"
import { formatCurrency } from "@/utils/helpers/currency"
import { Wrench, Note, CurrencyCircleDollar, HashStraight } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

export function DetailDamage({ invoiceItems }: { invoiceItems: InvoiceItemViewRes[] }) {
    const { t } = useTranslation()

    const itemDamage = invoiceItems?.filter((item) => item.type === InvoiceItemType.Damage) ?? []

    return (
        <div className="space-y-4">
            {itemDamage.length > 0 ? (
                itemDamage.map((value, index) => (
                    <div
                        key={value.id || index}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl 
                       bg-white dark:bg-gray-900 shadow-sm hover:shadow-md 
                       transition-shadow duration-300"
                    >
                        {/* Tên hạng mục */}
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Wrench size={20} className="text-primary" />
                                {value.checklistItem?.component?.name}
                            </p>
                            {/* Thông tin số lượng + chi phí */}
                            <div className="flex items-center gap-6 sm:gap-8">
                                {/* Số lượng */}
                                <p className="flex items-center text-sm sm:text-base text-gray-700 dark:text-gray-300 gap-1">
                                    <HashStraight size={18} className="text-teal-500" />
                                    <span className="font-medium">SL:</span> {value.quantity ?? 0}
                                </p>

                                {/* Chi phí */}
                                <p className="text-primary font-semibold flex items-center gap-1">
                                    <CurrencyCircleDollar size={18} weight="duotone" />
                                    {formatCurrency(value.subTotal ?? 0)}
                                </p>
                            </div>
                        </div>

                        {/* Mô tả */}
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                            <Note size={16} className="text-teal-500 mt-[2px]" />
                            {value.checklistItem?.notes ||
                                t("rental_contract.no_detailed_description")}
                        </p>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                    <Wrench size={28} className="mb-2 text-gray-400" />
                    <p className="italic">{t("rental_contract.no_damage_items")}</p>
                </div>
            )}
        </div>
    )
}
