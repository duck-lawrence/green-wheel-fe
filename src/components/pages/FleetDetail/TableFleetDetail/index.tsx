"use client"

import React from "react"
import { VehicleStatus } from "@/constants/enum"
import { useDay } from "@/hooks"

type TranslateFn = (key: string, fallback?: string) => string

export type VehicleRow = {
    id: string
    licensePlate: string | undefined
    stationName: string
    statusLabel: string
    statusClasses: string
    lastUpdatedLabel: string
}

export function TableFleetDetail({
    t,
    rows,
    isLoading
}: {
    t: TranslateFn
    rows: VehicleRow[]
    isLoading: boolean
}) {
    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="pl-5 text-2xl font-bold uppercase tracking-wide text-slate-950">
                        {t("fleet.detail_vehicle_table_title")}
                    </h2>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {t("vehicle.license_plate")}
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {t("vehicle.station_name")}
                            </th>
                            <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {t("vehicle.status_label")}
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {t("fleet.detail_vehicle_last_updated")}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-sm text-slate-500">
                                    {t("fleet.detail_vehicle_table_loading")}
                                </td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map((row) => (
                                <tr key={row.id} className="transition-colors hover:bg-slate-50">
                                    <td className="py-3 px-4 font-semibold text-slate-900">
                                        {row.licensePlate}
                                    </td>

                                    <td className="py-3 px-4 text-slate-700">{row.stationName}</td>

                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-flex min-w-[110px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${row.statusClasses}`}
                                        >
                                            {row.statusLabel}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4 text-slate-700">
                                        {row.lastUpdatedLabel}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-sm text-slate-500">
                                    {t("fleet.detail_vehicle_table_empty")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
