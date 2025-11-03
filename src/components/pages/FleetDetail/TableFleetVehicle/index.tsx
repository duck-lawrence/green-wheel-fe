"use client"

import { TableStyled } from "@/components"
import { Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

export type VehicleRow = {
    id: string
    licensePlate: string | undefined
    stationName: string
    statusLabel: string
    statusClasses: string
    lastUpdatedLabel: string
}

export function TableFleetVehicle({ rows, isLoading }: { rows: VehicleRow[]; isLoading: boolean }) {
    const { t } = useTranslation()

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-950">
                        {t("fleet.detail_vehicle_table_title")}
                    </h2>
                </div>
            </div>

            <TableStyled
                className="text-sm"
                classNames={{
                    base: "max-h-[400px] overflow-scroll",
                    table: "min-h-[380px]"
                }}
            >
                <TableHeader className="bg-slate-50">
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.license_plate")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.station_name")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.status_label")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("fleet.detail_vehicle_last_updated")}
                    </TableColumn>
                </TableHeader>

                <TableBody
                    loadingContent={<Spinner />}
                    loadingState={isLoading ? "loading" : "idle"}
                    emptyContent={t("fleet.detail_vehicle_table_empty")}
                    items={rows}
                >
                    {(item) => (
                        <TableRow key={item.id} className="transition-colors hover:bg-slate-50">
                            <TableCell className="py-3 px-4 font-semibold text-slate-900">
                                {item.licensePlate}
                            </TableCell>

                            <TableCell className="py-3 px-4 text-slate-700">
                                {item.stationName}
                            </TableCell>

                            <TableCell className="py-3 px-4 text-center">
                                <span
                                    className={`inline-flex min-w-[110px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${item.statusClasses}`}
                                >
                                    {item.statusLabel}
                                </span>
                            </TableCell>

                            <TableCell className="py-3 px-4 text-slate-700">
                                {item.lastUpdatedLabel}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </TableStyled>
        </section>
    )
}
