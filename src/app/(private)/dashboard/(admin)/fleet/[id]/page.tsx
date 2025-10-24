"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "@/components"
import { Image, Spinner } from "@heroui/react"
import { useGetAllVehicleModels } from "@/hooks"
import { formatCurrency } from "@/utils/helpers/currency"
import {
    VehicleModelImageRes,
    VehicleModelViewRes
} from "@/models/vehicle/schema/response"
import {
    BatteryCharging,
    CheckCircle,
    FlagCheckered,
    Gauge,
    ImageSquare,
    Images,
    PencilSimple,
    RoadHorizon,
    ShieldCheck,
    TrashSimple,
    UsersFour
} from "@phosphor-icons/react"

const PLACEHOLDER_IMAGE = "/images/vehicle-placeholder.png"
const MIN_GALLERY_ITEMS = 4

type GalleryImage = {
    url: string
    isPlaceholder: boolean
}

function useNormalizedVehicleModels(
    vehicleModelsData?: VehicleModelViewRes[]
): VehicleModelViewRes[] {
    return useMemo(() => {
        if (!vehicleModelsData || vehicleModelsData.length === 0) {
            return []
        }

        return vehicleModelsData.map((model) => {
            const rawModel = model as VehicleModelViewRes & {
                vehicleModelImages?: VehicleModelImageRes[]
            }
            const fallbackImages = Array.isArray(rawModel.vehicleModelImages)
                ? rawModel.vehicleModelImages.map((image) => image.imageUrl)
                : []
            const imageUrls =
                model.imageUrls && model.imageUrls.length > 0 ? model.imageUrls : fallbackImages
            const imageUrl = model.imageUrl ?? imageUrls[0]

            return {
                ...model,
                imageUrls,
                imageUrl
            }
        })
    }, [vehicleModelsData])
}

export default function AdminFleetDetailPage() {
    const params = useParams<{ id: string }>()
    const modelId = params?.id
    const router = useRouter()
    const { t } = useTranslation()

    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [isGalleryExpanded, setIsGalleryExpanded] = useState(false)

    const {
        data: vehicleModelsData,
        isLoading,
        isFetching
    } = useGetAllVehicleModels()

    const vehicleModels = useNormalizedVehicleModels(vehicleModelsData)

    const vehicleModel = useMemo(() => {
        if (!modelId) return undefined
        return vehicleModels.find((model) => model.id === modelId)
    }, [modelId, vehicleModels])

    const galleryImages = useMemo<GalleryImage[]>(() => {
        if (!vehicleModel) {
            return [
                {
                    url: PLACEHOLDER_IMAGE,
                    isPlaceholder: true
                }
            ]
        }

        const uniqueImages = new Set<string>()

        const registerImage = (url?: string | null) => {
            if (!url) return
            if (uniqueImages.has(url)) return
            uniqueImages.add(url)
        }

        registerImage(vehicleModel.imageUrl)
        if (Array.isArray(vehicleModel.imageUrls)) {
            vehicleModel.imageUrls.forEach(registerImage)
        }

        const resolvedImages: GalleryImage[] = Array.from(uniqueImages).map((url) => ({
            url,
            isPlaceholder: false
        }))

        if (resolvedImages.length === 0) {
            resolvedImages.push({
                url: PLACEHOLDER_IMAGE,
                isPlaceholder: true
            })
        }

        while (resolvedImages.length < MIN_GALLERY_ITEMS) {
            resolvedImages.push({
                url: PLACEHOLDER_IMAGE,
                isPlaceholder: true
            })
        }

        return resolvedImages
    }, [vehicleModel])

    const displayImages = useMemo(() => {
        const entries = galleryImages.map((image, index) => ({
            image,
            index
        }))

        if (entries.length <= 4) {
            return entries
        }

        const baseEntries = entries.slice(0, 4)
        if (activeImageIndex >= 4) {
            const activeEntry = entries[activeImageIndex]
            if (activeEntry) {
                baseEntries[baseEntries.length - 1] = activeEntry
            }
        }
        return baseEntries
    }, [activeImageIndex, galleryImages])

    const hasMoreImages = useMemo(() => galleryImages.length > 4, [galleryImages])

    const specItems = useMemo(() => {
        const unknown = t("fleet.detail_unknown", "Updating")
        const formatValue = (value?: number | string | null, unit?: string) => {
            if (value === undefined || value === null || value === "") return unknown
            return unit ? `${value} ${unit}` : `${value}`
        }

        return [
            {
                key: "capacity",
                label: t("fleet.spec_capacity", "Capacity"),
                value: formatValue(vehicleModel?.seatingCapacity, t("fleet.detail_seats_unit", "seats")),
                icon: <UsersFour size={18} weight="duotone" />
            },
            {
                key: "motorPower",
                label: t("fleet.spec_motor_power", "Motor power"),
                value: formatValue(vehicleModel?.motorPower, t("fleet.detail_kw_unit", "kW")),
                icon: <Gauge size={18} weight="duotone" />
            },
            {
                key: "batteryCapacity",
                label: t("fleet.spec_battery", "Battery"),
                value: formatValue(vehicleModel?.batteryCapacity, t("fleet.detail_kwh_unit", "kWh")),
                icon: <BatteryCharging size={18} weight="duotone" />
            },
            {
                key: "ecoRangeKm",
                label: t("fleet.spec_eco_range", "Eco range"),
                value: formatValue(vehicleModel?.ecoRangeKm, t("fleet.detail_km_unit", "km")),
                icon: <RoadHorizon size={18} weight="duotone" />
            },
            {
                key: "sportRangeKm",
                label: t("fleet.spec_sport_range", "Sport range"),
                value: formatValue(vehicleModel?.sportRangeKm, t("fleet.detail_km_unit", "km")),
                icon: <FlagCheckered size={18} weight="duotone" />
            },
            {
                key: "numberOfAirbags",
                label: t("fleet.spec_airbags", "Airbags"),
                value: formatValue(
                    vehicleModel?.numberOfAirbags,
                    t("fleet.detail_airbags_unit", "airbags")
                ),
                icon: <ShieldCheck size={18} weight="duotone" />
            }
        ]
    }, [t, vehicleModel])

    useEffect(() => {
        setActiveImageIndex(0)
        setIsGalleryExpanded(false)
    }, [modelId])

    useEffect(() => {
        setActiveImageIndex((prev) => {
            if (prev >= galleryImages.length) {
                return Math.max(0, galleryImages.length - 1)
            }
            return prev
        })
    }, [galleryImages.length])

    const handleThumbnailClick = useCallback((index: number) => {
        setActiveImageIndex(index)
    }, [])

    const handleToggleGallery = useCallback(() => {
        setIsGalleryExpanded((prev) => !prev)
    }, [])

    if (isLoading || isFetching) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center">
                <Spinner label={t("fleet.loading", "Loading")} />
            </div>
        )
    }

    if (!vehicleModel) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-center text-base font-semibold text-slate-600">
                    {t(
                        "fleet.detail_not_found",
                        "Vehicle model information is not available or has been removed."
                    )}
                </p>
                <ButtonStyled color="primary" onPress={() => router.push("/dashboard/fleet")}>
                    {t("fleet.back_to_list", "Back to fleet list")}
                </ButtonStyled>
            </div>
        )
    }

    const activeImage =
        galleryImages[activeImageIndex] ?? { url: PLACEHOLDER_IMAGE, isPlaceholder: true }
    const availabilityKey =
        vehicleModel.availableVehicleCount > 0 ? "fleet.status_available" : "fleet.status_out_of_stock"
    const availabilityLabel = t(
        availabilityKey,
        vehicleModel.availableVehicleCount > 0 ? "Available" : "Out of stock"
    )
    const descriptionText =
        vehicleModel.description?.trim() ||
        t("fleet.detail_description_empty", "This vehicle model has no description yet.")

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 space-y-10  rounded-3xl border border-slate-100 bg-white shadow-lg">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/fleet")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                    <span className="text-lg leading-none">
                        &#8592;
                    </span>
                    <span>{t("fleet.back_to_list", "Back to fleet")}</span>
                </button>
            </div>
            <section className="space-y-5">
                <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                    <Image
                        alt={`${vehicleModel.name} preview ${activeImageIndex + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        radius="none"
                        shadow="none"
                        src={activeImage.url}
                        loading="lazy"
                        removeWrapper
                    />
                    {activeImage.isPlaceholder ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 text-sm font-semibold text-slate-500">
                            <ImageSquare size={42} weight="duotone" className="text-slate-400" />
                            {t("fleet.detail_placeholder_caption", "No image available")}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {displayImages.map(({ image: galleryImage, index: imageIndex }) => {
                        const isActive = imageIndex === activeImageIndex
                        return (
                            <button
                                key={`${galleryImage.url}-${imageIndex}`}
                                type="button"
                                onClick={() => handleThumbnailClick(imageIndex)}
                                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <Image
                                    alt={`${vehicleModel.name} thumbnail ${imageIndex + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.05]"
                                    radius="none"
                                    shadow="none"
                                    src={galleryImage.url}
                                    loading="lazy"
                                    removeWrapper
                                />
                                {galleryImage.isPlaceholder ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-white/80 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        <ImageSquare size={22} weight="duotone" className="text-slate-300" />
                                        {t("fleet.detail_placeholder_short", "No image")}
                                    </div>
                                ) : null}
                                {isActive ? <span className="absolute inset-0 rounded-xl ring-2 ring-emerald-500" /> : null}
                            </button>
                        )
                    })}

                    {hasMoreImages ? (
                        <ButtonStyled
                            variant="bordered"
                            color="secondary"
                            onPress={handleToggleGallery}
                            startContent={<Images size={20} weight="bold" />}
                            className="h-20 w-28 shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 text-[13px] font-semibold text-emerald-600 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-100"
                        >
                            {isGalleryExpanded
                                ? t("fleet.hide_gallery", "Hide images")
                                : t("fleet.view_all_images", "View all images")}
                        </ButtonStyled>
                    ) : null}
                </div>
            </section>

            <section className="space-y-6  bg-white p-6 md:p-8 ">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                                {vehicleModel.segment?.name ?? t("fleet.detail_segment", "Segment")}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                <CheckCircle size={14} weight="bold" />
                                {availabilityLabel} ({vehicleModel.availableVehicleCount}{" "}
                                {t("fleet.detail_units_unit", "units")})
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-slate-900">{vehicleModel.name}</h1>
                            <p className="text-sm font-medium text-slate-500">
                                {vehicleModel.brand?.name ?? t("fleet.detail_brand", "Brand")}
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t("fleet.detail_model_id", "Model ID")}:{" "}
                                <span className="text-slate-700">{vehicleModel.id}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 md:items-end">
                        <div className="flex items-center gap-2">
                            <ButtonStyled
                                variant="light"
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-slate-700"
                                startContent={<PencilSimple size={16} weight="bold" />}
                            >
                                {t("common.edit", "Edit")}
                            </ButtonStyled>
                            <ButtonStyled
                                variant="light"
                                onPress={() => {}}
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-rose-600"
                                startContent={<TrashSimple size={16} weight="bold" />}
                            >
                                {t("common.delete", "Delete")}
                            </ButtonStyled>
                        </div>
                        <div className="text-right space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t("fleet.detail_cost_per_day", "Rental price")}
                            </span>
                            <p className="mt-1 text-3xl font-bold text-emerald-700">
                                {formatCurrency(vehicleModel.costPerDay)}
                                <span className="ml-1 text-sm font-medium text-emerald-600">
                                    /{t("fleet.detail_day_unit", "day")}
                                </span>
                            </p>
                            <p className="text-xs text-slate-500">
                                {t("fleet.detail_deposit_fee", "Deposit")}:{" "}
                                <strong className="text-slate-700">
                                    {formatCurrency(vehicleModel.depositFee)}
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-700">
                        {t("fleet.detail_about", "About")}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600">{descriptionText}</p>
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="pl-5 text-2xl font-bold uppercase tracking-wide text-slate-950">
                    {t("fleet.detail_spec_title", "Technical specifications")}
                </h2>
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-5">
                    {specItems.map((item) => (
                        <div key={item.key} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                                {item.icon}
                            </div>
                            <div>
                                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    {item.label}
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-slate-800">{item.value}</dd>
                            </div>
                        </div>
                    ))}
                </dl>
            </section>

            {isGalleryExpanded ? (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            {t("fleet.view_all_images", "All images")}
                        </h2>
                        <ButtonStyled
                            variant="light"
                            onPress={handleToggleGallery}
                            className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none hover:bg-slate-50"
                        >
                            {t("fleet.hide_gallery", "Hide images")}
                        </ButtonStyled>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {galleryImages.map((image, index) => (
                            <div
                                key={`${image.url}-${index}`}
                                className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
                            >
                                <Image
                                    alt={`${vehicleModel.name} gallery ${index + 1}`}
                                    className="h-full w-full object-cover"
                                    radius="none"
                                    shadow="none"
                                    src={image.url}
                                    loading="lazy"
                                    removeWrapper
                                />
                                {image.isPlaceholder ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <ImageSquare size={28} weight="duotone" className="text-slate-300" />
                                        {t("fleet.detail_placeholder_short", "No image")}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>

    )
}
