import { useEffect, useMemo } from "react"

import {
    useDay,
    useGetAllStations,
    useGetAllVehicles,
    useGetVehicleComponents,
    useGetVehicleModelByIdWithoutFilter
} from "@/hooks"

import { VehicleStatus } from "@/constants/enum"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

import { VehicleViewRes, VehicleComponentViewRes } from "@/models/vehicle/schema/response"
import { BackendError } from "@/models/common/response"

import { VehicleStatusColorMap } from "@/constants/colorMap"
import { VehicleRow } from "./TableFleetVehicle"
import { addToast } from "@heroui/toast"

/* -------------------------------------------------
   CONSTANT / TYPES / MAPS
------------------------------------------------- */

export type TranslateFn = (key: string, fallback?: string) => string
type FormatDateTimeFn = ReturnType<typeof useDay>["formatDateTime"]

export function mapVehiclesToRows(opts: {
    vehicles: VehicleViewRes[]
    t: TranslateFn
    formatDateTime: FormatDateTimeFn
    stationNameById: Record<string, string>
}): VehicleRow[] {
    const { vehicles, t, formatDateTime, stationNameById } = opts

    return vehicles.map((vehicle) => {
        const status: VehicleStatus | undefined =
            typeof vehicle.status === "number" ? (vehicle.status as VehicleStatus) : undefined

        const statusKey =
            status !== undefined ? VehicleStatus[status]?.toString().toLowerCase() : undefined

        const statusLabel = statusKey
            ? t(`vehicle.status_value_${statusKey}`, "vehicle.status_value_unknown")
            : t("vehicle.status_value_unknown")

        const statusClasses =
            status !== undefined && status in VehicleStatusColorMap
                ? VehicleStatusColorMap[status]
                : "bg-slate-100 text-slate-600"

        const rawUpdatedAt =
            vehicle.updatedAt || (vehicle as VehicleViewRes & { updated_at?: string }).updated_at

        const lastUpdatedLabel = rawUpdatedAt
            ? formatDateTime({ date: rawUpdatedAt })
            : t("fleet.vehicle_last_updated_unknown")

        const stationName = stationNameById[vehicle.stationId] ?? t("fleet.vehicle_unknown_station")

        return {
            id: vehicle.id,
            licensePlate: vehicle.licensePlate,
            stationName,
            statusLabel,
            statusClasses,
            lastUpdatedLabel
        }
    })
}

export function useFleetData(modelId: string) {
    const {
        data: vehicleModel,
        isLoading: isLoadingModel,
        isFetching: isFetchingModel,
        error: vehicleModelError,
        refetch: refetchVehicleModel
    } = useGetVehicleModelByIdWithoutFilter({ modelId })

    const {
        data: vehiclesPage,
        isFetching: isFetchingVehicles,
        error: vehiclesError
    } = useGetAllVehicles({
        params: modelId ? { modelId } : {},
        pagination: { pageNumber: 1, pageSize: 1000 },
        enabled: Boolean(modelId)
    })

    const {
        data: componentsPage,
        isFetching: isFetchingComponents,
        isLoading: isLoadingComponents,
        error: componentsError,
        refetch: refetchComponents
    } = useGetVehicleComponents({
        params: modelId ? { modelId } : {},
        pagination: { pageNumber: 1, pageSize: 100 },
        enabled: Boolean(modelId)
    })

    const { data: stations = [], error: stationsError } = useGetAllStations({
        enabled: Boolean(modelId)
    })

    const stationNameById = useMemo(() => {
        return stations.reduce<Record<string, string>>((acc, st) => {
            acc[st.id] = st.name
            return acc
        }, {})
    }, [stations])

    const vehiclesOfModel = useMemo(() => {
        const allVehicles = (vehiclesPage?.items ?? []) as VehicleViewRes[]
        if (!modelId) return allVehicles
        return allVehicles.filter((v) => {
            const fromRel = v.model?.id
            const fromLegacy = (v as VehicleViewRes & { modelId?: string }).modelId
            return fromRel === modelId || fromLegacy === modelId
        })
    }, [modelId, vehiclesPage])

    const componentsOfModel = useMemo(() => {
        return (componentsPage?.items ?? []) as VehicleComponentViewRes[]
    }, [componentsPage])

    return {
        vehicleModel,
        vehiclesOfModel,
        stationNameById,
        isLoading: isLoadingModel,
        isFetchingAny: isFetchingModel,
        isFetchingVehicles,
        isFetchingComponents,
        isLoadingComponents,
        vehicleModelError,
        vehiclesError,
        componentsError,
        stationsError,
        refetchVehicleModel,
        componentsOfModel,
        refetchComponents
    }
}

export function useApiErrorToasts(errors: Array<BackendError | unknown>, t: any) {
    useEffect(() => {
        errors.forEach((err) => {
            if (!err) return
            const be = err as BackendError
            addToast({
                title: be.title || t("toast.error"),
                description: translateWithFallback(t, be.detail),
                color: "danger"
            })
        })
    }, [errors, t])
}
