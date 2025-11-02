"use client"

import React from "react"
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

import {
    ButtonStyled,
    VehicleSubImagesScroll
} from "@/components"
import { DEFAULT_VEHICLE_MODEL } from "@/constants/constants"
import { formatCurrency } from "@/utils/helpers/currency"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"

type FleetDetailLayoutProps = {
    children: React.ReactNode
}

export function FleetDetailLayout({ children }: FleetDetailLayoutProps) {
    return (
        <div className="mx-auto mb-6 max-w-5xl space-y-10 rounded-3xl border border-slate-100 bg-white px-4 py-10 shadow-lg">
            {children}
        </div>
    )
}

type FleetBackButtonProps = {
    onBack: () => void
    label: string
}

export function FleetBackButton({ onBack, label }: FleetBackButtonProps) {
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

type FleetInfoHeaderProps = {
    t: (key: string, fallback?: string) => string
    vehicleModel: VehicleModelViewRes
    availabilityLabel: string
    isAvailable: boolean
    subImgUrls: string[]
    activeImage: number
    onSelectImage: (index: number) => void
    onEdit: () => void
    onDelete: () => void
}

export function FleetInfoHeader(props: FleetInfoHeaderProps) {
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
                                src={subImgUrls[activeImage] ?? DEFAULT_VEHICLE_MODEL}
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
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-primary"
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

type FleetSpecSectionProps = {
    t: (key: string, fallback?: string) => string
    vehicleModel: VehicleModelViewRes
}

export function FleetSpecSection({
    t,
    vehicleModel
}: FleetSpecSectionProps) {
    const unknown = t("fleet.detail_unknown")

    const pretty = (
        value?: number | string | null,
        unit?: string
    ): string => {
        if (value === undefined || value === null || value === "") {
            return unknown
        }

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

            <dl className="grid gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-3">
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

export default FleetDetailLayout
