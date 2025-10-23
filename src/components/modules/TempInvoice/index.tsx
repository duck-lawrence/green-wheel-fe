"use client"

import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"
import React from "react"
import { useTranslation } from "react-i18next"

export function TempInvoice({
    model,
    totalDays,
    totalPrice
}: {
    model: VehicleModelViewRes
    totalDays: number
    totalPrice: number
}) {
    const { t } = useTranslation()

    return (
        <div className="rounded-xl bg-neutral-50 p-4">
            <div className="flex items-center justify-between text-sm">
                <span>{t("vehicle_model.unit_price")}</span>
                <span className="font-medium">{formatCurrency(model.costPerDay)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
                <span>{t("vehicle_model.number_of_days")}</span>
                <span className="font-medium">{totalDays}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
                <span>{t("vehicle_model.deposit_fee")}</span>
                <span className="font-medium">{formatCurrency(model.depositFee)}</span>
            </div>

            <div className="mt-3 h-px bg-neutral-200" />
            <div className="mt-3 flex items-center justify-between text-base font-semibold">
                <span>{t("vehicle_model.temporary_total")}</span>
                <span className="text-emerald-700">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-end italic text-sm text-gray-400">
                <span>{t("vehicle_model.not_include_tax")}</span>
            </div>
        </div>
    )
}
