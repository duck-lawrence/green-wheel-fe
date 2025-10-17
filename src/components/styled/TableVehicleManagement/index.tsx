"use client"
import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PencilSimpleLine, XCircle } from "@phosphor-icons/react"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner } from "@heroui/react"

import { VehicleStatus } from "@/constants/enum"
import { VehicleModelViewRes, VehicleViewRes } from "@/models/vehicle/schema/response"

type VehicleWithStatus = VehicleViewRes & { status?: VehicleStatus; modelId?: string }

type TableVehicleManagementProps = {
    vehicles: VehicleWithStatus[]
    stationNameById: Record<string, string>
    vehicleModelsById: Record<string, VehicleModelViewRes>
    isLoading?: boolean
    isModelsLoading?: boolean
    onEdit?: (vehicle: VehicleWithStatus) => void
    onDelete?: (vehicle: VehicleWithStatus) => void
}

const STATUS_CLASS_MAP: Record<VehicleStatus, string> = {
    [VehicleStatus.Available]: "bg-emerald-100 text-emerald-700",
    [VehicleStatus.Unavailable]: "bg-amber-100 text-amber-700",
    [VehicleStatus.Rented]: "bg-blue-100 text-blue-700",
    [VehicleStatus.Maintenance]: "bg-orange-100 text-orange-700",
    [VehicleStatus.MissingNoReason]: "bg-rose-100 text-rose-700",
    [VehicleStatus.LateReturn]: "bg-purple-100 text-purple-700"
}

export function TableVehicleManagement({
    vehicles,
    stationNameById,
    isLoading,
    vehicleModelsById,
    isModelsLoading,
    onEdit,
    onDelete
}: TableVehicleManagementProps) {
    const { t } = useTranslation()

    const isTableLoading = Boolean(isLoading || isModelsLoading)

    const rows = useMemo(() => {
        return vehicles.map((vehicle) => {
            const rawModel = vehicle.model
            const modelId = (rawModel?.id ?? vehicle.modelId) ?? undefined
            const resolvedModel = modelId ? vehicleModelsById[modelId] ?? rawModel : rawModel
            const status = vehicle.status
            const statusKey =
                typeof status === "number" && status in VehicleStatus
                    ? VehicleStatus[status as VehicleStatus]
                    : undefined
            const normalizedStatusKey = statusKey?.toString().toLowerCase()
            const defaultLabel = normalizedStatusKey
                ? normalizedStatusKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
                : t("vehicle.status_value_unknown")
            const statusLabel = normalizedStatusKey
                ? t(`vehicle.status_value_${normalizedStatusKey}`)
                : defaultLabel
            const statusClasses =
                status != null && status in STATUS_CLASS_MAP
                    ? STATUS_CLASS_MAP[status as VehicleStatus]
                    : "bg-slate-100 text-slate-600"

            const stationName = stationNameById[vehicle.stationId] ?? t("table.unknown_station")
            const brandName =
                (resolvedModel &&
                "brandName" in resolvedModel &&
                typeof (resolvedModel as any).brandName === "string"
                    ? (resolvedModel as any).brandName
                    : resolvedModel?.brand?.name) ?? t("table.unknown_brand")
            const modelName = resolvedModel?.name ?? t("table.unknown_model")

            return (
                <TableRow key={vehicle.id} className="border-b border-slate-100 last:border-0">
                    <TableCell className="py-3 px-4 font-medium text-slate-900">
                        {vehicle.licensePlate}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-slate-700">
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{brandName}</span>
                            <span className="text-xs text-slate-500">{modelName}</span>
                        </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-slate-700">{stationName}</TableCell>
                    <TableCell className="py-3 px-4">
                        <div className="flex justify-center">
                            <span
                                className={`inline-flex min-w-[120px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                            >
                                {statusLabel}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                aria-label={t("common.edit")}
                                onClick={() => onEdit?.(vehicle)}
                                className="rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                <PencilSimpleLine size={18} weight="duotone" aria-hidden />
                            </button>
                            <button
                                type="button"
                                aria-label={t("common.delete")}
                                onClick={() => onDelete?.(vehicle)}
                                className="rounded-full bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                            >
                                <XCircle size={18} weight="duotone" aria-hidden />
                            </button>
                        </div>
                    </TableCell>
                </TableRow>
            )
        })
    }, [onDelete, onEdit, stationNameById, t, vehicles, vehicleModelsById])

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <Table aria-label="Vehicle management table" removeWrapper className="min-w-full text-sm">
                <TableHeader>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.license_plate")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.model_name")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.station_name")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.status_label")}
                    </TableColumn>
                    <TableColumn className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={
                        isTableLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Spinner size="sm" />
                            </div>
                        ) : (
                            <span className="py-8 text-slate-500">
                                {t("vehicle.management_empty")}
                            </span>
                        )
                    }
                >
                    {rows}
                </TableBody>
            </Table>
        </div>
    )
}
