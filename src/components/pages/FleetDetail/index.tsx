"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

import {
    ButtonStyled,
    useModalDisclosure,
    VehicleModelDeleteModal,
    VehicleModelEditModal,
    EditModelComponentModal
} from "@/components"
import {
    FleetDetailLayout,
    FleetBackButton,
    FleetInfoHeader,
    FleetSpecSection
} from "./FleetDetailLayout"

import {
    useDay,
    useGetAllBrands,
    useGetAllStations,
    useGetAllVehicleModels,
    useGetAllVehicleSegments,
    useGetAllVehicles,
    useGetVehicleComponents
} from "@/hooks"

import { VehicleStatus } from "@/constants/enum"
import { DEFAULT_VEHICLE_MODEL } from "@/constants/constants"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

import {
    VehicleModelViewRes,
    VehicleViewRes,
    VehicleComponentViewRes
} from "@/models/vehicle/schema/response"
import { BackendError } from "@/models/common/response"

import { TableFleetVehicle, VehicleRow } from "./TableFleetVehicle"
import { TableFleetComponent } from "./TableFleetComponent"

/* -------------------------------------------------
   CONSTANT / TYPES / MAPS
------------------------------------------------- */

const VEHICLE_STATUS_CLASS_MAP: Record<VehicleStatus, string> = {
    [VehicleStatus.Available]: "bg-emerald-100 text-emerald-700",
    [VehicleStatus.Unavailable]: "bg-slate-200 text-slate-600",
    [VehicleStatus.Rented]: "bg-blue-100 text-blue-700",
    [VehicleStatus.Maintenance]: "bg-orange-100 text-orange-700",
    [VehicleStatus.MissingNoReason]: "bg-rose-100 text-rose-700",
    [VehicleStatus.LateReturn]: "bg-purple-100 text-purple-700"
}

type TranslateFn = (key: string, fallback?: string) => string
type FormatDateTimeFn = ReturnType<typeof useDay>["formatDateTime"]

/* -------------------------------------------------
   HELPERS / HOOKS (internal to the page)
------------------------------------------------- */

function mapVehiclesToRows(opts: {
    vehicles: VehicleViewRes[]
    t: TranslateFn
    formatDateTime: FormatDateTimeFn
    stationNameById: Record<string, string>
}): VehicleRow[] {
    const { vehicles, t, formatDateTime, stationNameById } = opts

    return vehicles.map((vehicle) => {
        const status: VehicleStatus | undefined =
            typeof vehicle.status === "number"
                ? (vehicle.status as VehicleStatus)
                : undefined

        const statusKey =
            status !== undefined
                ? VehicleStatus[status]?.toString().toLowerCase()
                : undefined

        const statusLabel = statusKey
            ? t(`vehicle.status_value_${statusKey}`)
            : t("vehicle.status_value_unknown")

        const statusClasses =
            status !== undefined && status in VEHICLE_STATUS_CLASS_MAP
                ? VEHICLE_STATUS_CLASS_MAP[status]
                : "bg-slate-100 text-slate-600"

        const rawUpdatedAt =
            vehicle.updatedAt ||
            (vehicle as VehicleViewRes & { updated_at?: string }).updated_at

        const lastUpdatedLabel = rawUpdatedAt
            ? formatDateTime({ date: rawUpdatedAt })
            : t("fleet.vehicle_last_updated_unknown")

        const stationName =
            stationNameById[vehicle.stationId] ??
            t("fleet.vehicle_unknown_station")

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

function useFleetData(modelId: string | undefined) {
    const {
        data: vehicleModelsData = [],
        isLoading: isLoadingModels,
        isFetching: isFetchingModels,
        error: vehicleModelsError,
        refetch: refetchVehicleModels
    } = useGetAllVehicleModels({ query: {} })

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

    const {
        data: stations = [],
        error: stationsError
    } = useGetAllStations({ enabled: Boolean(modelId) })

    const stationNameById = useMemo(() => {
        return stations.reduce<Record<string, string>>((acc, st) => {
            acc[st.id] = st.name
            return acc
        }, {})
    }, [stations])

    const vehicleModel = useMemo(() => {
        if (!modelId) return undefined
        return vehicleModelsData.find((m) => m.id === modelId)
    }, [modelId, vehicleModelsData])

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
        isLoading: isLoadingModels,
        isFetchingAny: isFetchingModels,
        isFetchingVehicles,
        isFetchingComponents,
        isLoadingComponents,
        vehicleModelsError,
        vehiclesError,
        componentsError,
        stationsError,
        vehicleModels: vehicleModelsData,
        refetchVehicleModels,
        componentsOfModel,
        refetchComponents
    }
}

function useApiErrorToasts(errors: Array<BackendError | unknown>, t: any) {
    useEffect(() => {
        errors.forEach((err) => {
            if (!err) return
            const be = err as BackendError
            toast.error(translateWithFallback(t, be.detail))
        })
    }, [errors, t])
}


/* -------------------------------------------------
   MAIN SCREEN COMPONENT (like VehicleChecklistDetail)
------------------------------------------------- */

export function AdminFleetDetail({ modelId }: { modelId: string }) {
    const router = useRouter()
    const { t } = useTranslation()

    const translate = useCallback<TranslateFn>(
        (key, fallback) => translateWithFallback(t, key, fallback),
        [t]
    )

    const { formatDateTime } = useDay({
        defaultFormat: "DD/MM/YYYY HH:mm"
    })

    const { data: vehicleSegments = [] } = useGetAllVehicleSegments({
        enabled: true
    })

    const {
        vehicleModel,
        vehiclesOfModel,
        componentsOfModel,
        stationNameById,
        isLoading,
        isFetchingAny,
        isFetchingVehicles,
        isFetchingComponents,
        isLoadingComponents,
        vehicleModelsError,
        vehiclesError,
        componentsError,
        stationsError,
        vehicleModels,
        refetchVehicleModels,
        refetchComponents
    } = useFleetData(modelId)

    const { data: brands = [] } = useGetAllBrands()

    const brandOptions = useMemo(() => {
        return brands.map((brand) => ({
            id: brand.id,
            label: brand.name,
            // description: brand.description,
            // country: brand.country,
            // foundedYear: brand.foundedYear
        }))
        // .sort((a, b) => a.label.localeCompare(b.label))
    }, [brands])

    const segmentOptions = useMemo(() => {
        const unique = new Map<string, string>()
        vehicleSegments.forEach((segment) => {
            unique.set(segment.id, segment.name)
        })
        if (vehicleModel?.segment?.id && vehicleModel.segment?.name) {
            unique.set(vehicleModel.segment.id, vehicleModel.segment.name)
        }
        return Array.from(unique.entries())
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [
        vehicleSegments,
        vehicleModel?.segment?.id,
        vehicleModel?.segment?.name
    ])

    const {
        isOpen: isEditModalOpen,
        onOpen: onEditModalOpen,
        onClose: onEditModalClose,
        onOpenChange: onEditModalOpenChange
    } = useModalDisclosure()

    const {
        isOpen: isComponentModalOpen,
        onOpen: onComponentModalOpen,
        onClose: onComponentModalClose,
        onOpenChange: onComponentModalOpenChange
    } = useModalDisclosure()

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose,
        onOpenChange: onDeleteModalOpenChange
    } = useModalDisclosure()

    const handleVehicleModelUpdated = useCallback(() => {
        void refetchVehicleModels()
        void refetchComponents()
    }, [refetchVehicleModels, refetchComponents])

    const handleVehicleModelDeleted = useCallback(() => {
        router.push("/dashboard/fleet")
    }, [router])

    // toast all API errors (models / vehicles / stations)
    useApiErrorToasts(
        [vehicleModelsError, vehiclesError, componentsError, stationsError],
        t
    )

    // table rows data
    const vehicleRows: VehicleRow[] = useMemo(
        () =>
            mapVehiclesToRows({
                vehicles: vehiclesOfModel,
                t: translate,
                formatDateTime,
                stationNameById
            }),
        [vehiclesOfModel, translate, formatDateTime, stationNameById]
    )

    const componentIdsForModal = useMemo(() => {
        if (vehicleModel?.componentIds?.length) {
            return [...vehicleModel.componentIds]
        }
        return componentsOfModel.map((component) => component.id)
    }, [vehicleModel?.componentIds, componentsOfModel])

    const isComponentTableLoading =
        isLoadingComponents || (isFetchingComponents && componentsOfModel.length === 0)

    const isComponentEditDisabled = !vehicleModel || isLoadingComponents

    // availability text (stock or none)
    const availabilityInfo = useMemo(() => {
        if (!vehicleModel) return { label: "", isAvailable: false }
        const hasStock = vehicleModel.availableVehicleCount > 0
        return {
            label: translate(
                hasStock
                    ? "fleet.status_available"
                    : "fleet.status_unavailable",
                hasStock ? "Available" : "Unavailable"
            ),
            isAvailable: hasStock
        }
    }, [vehicleModel, translate])
    const { label: availabilityLabel, isAvailable } = availabilityInfo

    // images for gallery
    const subImgUrls = useMemo(() => {
        if (!vehicleModel) return [DEFAULT_VEHICLE_MODEL]
        const images = [
            vehicleModel.imageUrl,
            ...(vehicleModel.imageUrls ?? [])
        ].filter((src): src is string => Boolean(src))
        return images.length > 0 ? images : [DEFAULT_VEHICLE_MODEL]
    }, [vehicleModel])

    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        setActiveImage(0)
    }, [vehicleModel?.id])

    useEffect(() => {
        if (activeImage >= subImgUrls.length) {
            setActiveImage(0)
        }
    }, [activeImage, subImgUrls])

    // loading state (API)
    if (isLoading || isFetchingAny) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center">
                <Spinner label={t("fleet.loading")} />
            </div>
        )
    }

    // not found
    if (!vehicleModel) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-center text-base font-semibold text-slate-600">
                    {t(
                        "fleet.detail_not_found",
                        "Vehicle model information is not available or has been removed."
                    )}
                </p>

                <ButtonStyled
                    color="primary"
                    onPress={() => router.push("/dashboard/fleet")}
                >
                    {t("fleet.back_to_list")}
                </ButtonStyled>
            </div>
        )
    }

    // main layout
    return (
        <FleetDetailLayout>
            <FleetBackButton
                onBack={() => router.push("/dashboard/fleet")}
                label={t("fleet.back_to_list")}
            />

            <FleetInfoHeader
                t={translate}
                vehicleModel={vehicleModel}
                availabilityLabel={availabilityLabel}
                isAvailable={isAvailable}
                subImgUrls={subImgUrls}
                activeImage={activeImage}
                onSelectImage={setActiveImage}
                onEdit={onEditModalOpen}
                onDelete={onDeleteModalOpen}
            />

            <FleetSpecSection
                t={translate}
                vehicleModel={vehicleModel}
            />

            <TableFleetVehicle
                t={translate}
                rows={vehicleRows}
                isLoading={isFetchingVehicles}
            />

            <TableFleetComponent
                items={componentsOfModel}
                isLoading={isComponentTableLoading}
                onEditComponents={onComponentModalOpen}
                isEditDisabled={isComponentEditDisabled}
            />

            <EditModelComponentModal
                isOpen={isComponentModalOpen}
                onOpenChange={onComponentModalOpenChange}
                onClose={onComponentModalClose}
                modelId={vehicleModel.id}
                selectedComponentIds={componentIdsForModal}
                onUpdated={handleVehicleModelUpdated}
            />

            <VehicleModelEditModal
                isOpen={isEditModalOpen}
                onOpenChange={onEditModalOpenChange}
                onClose={onEditModalClose}
                vehicleModel={vehicleModel}
                brandOptions={brandOptions}
                segmentOptions={segmentOptions}
                onUpdated={handleVehicleModelUpdated}
            />

            <VehicleModelDeleteModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalOpenChange}
                onClose={onDeleteModalClose}
                modelName={vehicleModel.name}
                vehicleCount={vehicleModel.availableVehicleCount ?? 0}
                modelId={vehicleModel.id}
                onDeleted={handleVehicleModelDeleted}
            />
        </FleetDetailLayout>
    )
}
