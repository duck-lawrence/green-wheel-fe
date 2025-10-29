"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@heroui/react"
import {
    BatteryCharging,
    CheckCircle,
    FlagCheckered,
    Gauge,
    PencilSimple,
    RoadHorizon,
    ShieldCheck,
    TrashSimple,
    UsersFour
} from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

import {
    ButtonStyled,
    useModalDisclosure,
    VehicleModelDeleteModal,
    VehicleModelEditModal,
    VehicleSubImagesScroll
} from "@/components"

import {
    useDay,
    useGetAllStations,
    useGetAllVehicleModels,
    useGetAllVehicleSegments,
    useGetAllVehicles
} from "@/hooks"

import { VehicleStatus } from "@/constants/enum"
import { FALLBACK_IMAGE_URL } from "@/constants/constants"
import { formatCurrency } from "@/utils/helpers/currency"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

import {
    VehicleModelViewRes,
    VehicleViewRes
} from "@/models/vehicle/schema/response"
import { BackendError } from "@/models/common/response"

import { TableFleetDetail, VehicleRow } from "./TableFleetDetail"

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

    return {
        vehicleModel,
        vehiclesOfModel,
        stationNameById,
        isLoading: isLoadingModels,
        isFetchingAny: isFetchingModels,
        isFetchingVehicles,
        vehicleModelsError,
        vehiclesError,
        stationsError,
        vehicleModels: vehicleModelsData,
        refetchVehicleModels
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
   LOCAL SUBCOMPONENTS (just like VehicleChecklistDetail keeps its own sections)
------------------------------------------------- */

function FleetBackButton({
    onBack,
    label
}: {
    onBack: () => void
    label: string
}) {
    return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
                <span className="text-lg leading-none">&#8592;</span>
                <span>{label}</span>
            </button>
        </div>
    )
}

function FleetInfoHeader(props: {
    t: TranslateFn
    vehicleModel: VehicleModelViewRes
    availabilityLabel: string
    isAvailable: boolean
    subImgUrls: string[]
    activeImage: number
    onSelectImage: (index: number) => void
    onEdit: () => void
    onDelete: () => void
}) {
    const {
        t,
        vehicleModel,
        availabilityLabel,
        isAvailable,
        subImgUrls,
        activeImage,
        onSelectImage,
        onEdit,
        onDelete
    } = props

    const availabilityBadgeClasses = isAvailable
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-200 text-slate-600"

    return (
        <section className="space-y-6 bg-white p-6 md:p-8">
            <div className="space-y-6">
                <div className="w-full">
                    <div className="mx-auto w-full max-w-xl">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                            <img
                                src={subImgUrls[activeImage] ?? FALLBACK_IMAGE_URL}
                                alt={vehicleModel.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="mx-auto mt-4 w-full max-w-xl">
                        <VehicleSubImagesScroll
                            subImgUrls={subImgUrls}
                            active={activeImage}
                            setActive={onSelectImage}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black-600">
                                {vehicleModel.segment?.name ??
                                    t("fleet.detail_segment")}
                            </span>

                            <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${availabilityBadgeClasses}`}
                            >
                                {isAvailable && (
                                    <CheckCircle size={14} weight="bold" />
                                )}
                                {availabilityLabel}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-slate-900">
                                {vehicleModel.name}
                            </h1>

                            <p className="text-sm font-medium text-slate-500">
                                {vehicleModel.brand?.name ??
                                    t("fleet.detail_brand")}
                            </p>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t("fleet.detail_model_id")}:{" "}
                                <span className="text-slate-700">
                                    {vehicleModel.id}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 md:items-end">
                        <div className="flex items-center gap-2">
                            <ButtonStyled
                                variant="light"
                                onPress={onEdit}
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-slate-700"
                                startContent={
                                    <PencilSimple size={16} weight="bold" />
                                }
                            >
                                {t("common.edit")}
                            </ButtonStyled>

                            <ButtonStyled
                                variant="light"
                                onPress={onDelete}
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-rose-600"
                                startContent={
                                    <TrashSimple size={16} weight="bold" />
                                }
                            >
                                {t("common.delete")}
                            </ButtonStyled>
                        </div>

                        <div className="space-y-1 text-right">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t("fleet.detail_cost_per_day")}
                            </span>

                            <p className="mt-1 text-3xl font-bold text-emerald-700">
                                {formatCurrency(vehicleModel.costPerDay)}
                                <span className="ml-1 text-sm font-medium text-emerald-600">
                                    /{t("fleet.detail_day_unit")}
                                </span>
                            </p>

                            <p className="text-xs text-slate-500">
                                {t("fleet.detail_deposit_fee")}:{" "}
                                <strong className="text-slate-700">
                                    {formatCurrency(vehicleModel.depositFee)}
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* description */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-700">
                    {t("fleet.detail_about")}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                    {vehicleModel.description?.trim() ||
                        t("fleet.detail_description_empty")}
                </p>
            </div>
        </section>
    )
}

function FleetSpecSection({
    t,
    vehicleModel
}: {
    t: TranslateFn
    vehicleModel: VehicleModelViewRes
}) {
    const unknown = t("fleet.detail_unknown")

    const pretty = (
        value?: number | string | null,
        unit?: string
    ): string => {
        if (value === undefined || value === null || value === "") return unknown
        return unit ? `${value} ${unit}` : `${value}`
    }

    const items = [
        {
            key: "capacity",
            label: t("fleet.spec_capacity"),
            value: pretty(
                vehicleModel.seatingCapacity,
                t("fleet.detail_seats_unit")
            ),
            icon: <UsersFour size={18} weight="duotone" />
        },
        {
            key: "motorPower",
            label: t("fleet.spec_motor_power"),
            value: pretty(
                vehicleModel.motorPower,
                t("fleet.detail_kw_unit")
            ),
            icon: <Gauge size={18} weight="duotone" />
        },
        {
            key: "batteryCapacity",
            label: t("fleet.spec_battery"),
            value: pretty(
                vehicleModel.batteryCapacity,
                t("fleet.detail_kwh_unit")
            ),
            icon: <BatteryCharging size={18} weight="duotone" />
        },
        {
            key: "ecoRangeKm",
            label: t("fleet.spec_eco_range"),
            value: pretty(
                vehicleModel.ecoRangeKm,
                t("fleet.detail_km_unit")
            ),
            icon: <RoadHorizon size={18} weight="duotone" />
        },
        {
            key: "sportRangeKm",
            label: t("fleet.spec_sport_range"),
            value: pretty(
                vehicleModel.sportRangeKm,
                t("fleet.detail_km_unit")
            ),
            icon: <FlagCheckered size={18} weight="duotone" />
        },
        {
            key: "numberOfAirbags",
            label: t("fleet.spec_airbags"),
            value: pretty(
                vehicleModel.numberOfAirbags,
                t("fleet.detail_airbags_unit")
            ),
            icon: <ShieldCheck size={18} weight="duotone" />
        }
    ]

    return (
        <section className="space-y-3">
            <h2 className="pl-5 text-2xl font-bold uppercase tracking-wide text-slate-950">
                {t("fleet.detail_spec_title")}
            </h2>

            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-5">
                {items.map((item) => (
                    <div
                        key={item.key}
                        className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            {item.icon}
                        </div>
                        <div>
                            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                {item.label}
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                {item.value}
                            </dd>
                        </div>
                    </div>
                ))}
            </dl>
        </section>
    )
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
        stationNameById,
        isLoading,
        isFetchingAny,
        isFetchingVehicles,
        vehicleModelsError,
        vehiclesError,
        stationsError,
        vehicleModels,
        refetchVehicleModels
    } = useFleetData(modelId)

    const brandOptions = useMemo(() => {
        const unique = new Map<string, string>()
        vehicleModels.forEach((model) => {
            if (model.brand?.id && model.brand?.name) {
                unique.set(model.brand.id, model.brand.name)
            }
        })
        if (vehicleModel?.brand?.id && vehicleModel.brand?.name) {
            unique.set(vehicleModel.brand.id, vehicleModel.brand.name)
        }
        return Array.from(unique.entries())
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [vehicleModels, vehicleModel?.brand?.id, vehicleModel?.brand?.name])

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
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose,
        onOpenChange: onDeleteModalOpenChange
    } = useModalDisclosure()

    const handleVehicleModelUpdated = useCallback(() => {
        void refetchVehicleModels()
    }, [refetchVehicleModels])

    const handleVehicleModelDeleted = useCallback(() => {
        router.push("/dashboard/fleet")
    }, [router])

    // toast all API errors (models / vehicles / stations)
    useApiErrorToasts(
        [vehicleModelsError, vehiclesError, stationsError],
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
        if (!vehicleModel) return [FALLBACK_IMAGE_URL]
        const images = [
            vehicleModel.imageUrl,
            ...(vehicleModel.imageUrls ?? [])
        ].filter((src): src is string => Boolean(src))
        return images.length > 0 ? images : [FALLBACK_IMAGE_URL]
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
        <div className="mx-auto mb-6 max-w-5xl space-y-10 rounded-3xl border border-slate-100 bg-white px-4 py-10 shadow-lg">
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

            <TableFleetDetail
                t={translate}
                rows={vehicleRows}
                isLoading={isFetchingVehicles}
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
        </div>
    )
}
