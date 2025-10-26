"use client"

import React from "react"
import { Button, Chip, Image, cn } from "@heroui/react"
import { EyeIcon, SteeringWheel, UsersFour } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"
import { CardStyled } from "@/components"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { formatCurrency } from "@/utils/helpers/currency"

type VehicleHorizontalCardProps = {
    vehicleModel: VehicleModelViewRes
    onSelect?: (vehicleModel: VehicleModelViewRes) => void
    className?: string
    readOnly?: boolean
}

type SpecItem = {
    icon: React.ReactNode
    label: string
    value: string
    className?: string
}

export function VehicleHorizontalCard({
    vehicleModel,
    onSelect,
    className,
    readOnly
}: VehicleHorizontalCardProps) {
    const { t } = useTranslation()
    const {
        name,
        brand,
        segment,
        imageUrl,
        imageUrls,
        seatingCapacity,
        availableVehicleCount,
        costPerDay
    } = vehicleModel

    const brandName = brand?.name ?? t("vehicle_model.brand_unknown", "Unknown brand")
    const segmentName = segment?.name ?? t("vehicle_model.segment_unknown", "Unknown segment")
    const isAvailable = availableVehicleCount > 0
    const cover = imageUrl ?? imageUrls?.[0] ?? "/images/vehicle-placeholder.png"
    const unitLabel = t("vehicle_model.unit", "Unit")

    const typeSpec: SpecItem = {
        icon: <SteeringWheel className="h-5 w-5" weight="bold" />,
        label: t("vehicle_model.segment", "Type car"),
        value: segmentName
    }

    const capacitySpec: SpecItem = {
        icon: <UsersFour className="h-5 w-5" weight="bold" />,
        label: t("vehicle_model.capacity_label", "Capacity"),
        value: `${seatingCapacity} ${t("vehicle_model.seats", "seats")}`
    }

    return (
        <CardStyled
            shadow="sm"
            className={cn(
                "space-y-0 bg-white p-6 sm:p-8",
                "hover:shadow-xl interactive-scale",
                className
            )}
        >
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:gap-6 lg:flex-nowrap">
                <div className="flex justify-center lg:w-[160px]">
                    <div className="relative h-24 w-36 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-44">
                        <Image
                            alt={`${brandName} ${name}`}
                            className="h-full w-full object-cover"
                            radius="none"
                            shadow="none"
                            src={cover}
                            loading="lazy"
                            removeWrapper
                        />
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center gap-3 text-center lg:min-w-[200px] lg:items-start lg:text-left">
                    <div className="space-y-1">
                        <span className="text-sm text-slate-500">{brandName}</span>
                        <h3 className="text-2xl font-semibold text-slate-900">{name}</h3>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-0 lg:justify-start">
                        <Chip
                            size="sm"
                            variant="solid"
                            color={isAvailable ? "success" : "default"}
                            className={cn(
                                "px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                                !isAvailable && "bg-slate-200 text-slate-500"
                            )}
                        >
                            {isAvailable
                                ? t("vehicle_model.available", "Available")
                                : t("vehicle_model.unavailable", "Unavailable")}
                        </Chip>

                        <Chip
                            size="sm"
                            variant="flat"
                            className="bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                            {availableVehicleCount} {unitLabel}
                        </Chip>
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <SpecColumn {...typeSpec} />
                    <SpecColumn {...capacitySpec} />
                </div>
                <div className="flex w-full max-w-[160px] flex-col items-center gap-2 text-center lg:ml-auto lg:items-end lg:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t("vehicle_model.price_label", "Price")}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(costPerDay)}
                        <span className="ml-1 text-sm font-medium text-slate-500">
                            /{t("vehicle_model.vnd_per_day", "days")}
                        </span>
                    </p>
                </div>

                {!readOnly && (
                    <Button
                        // color="danger"
                        color="primary"
                        variant="ghost"
                        className="border-none p-3 min-w-fit"
                        isDisabled={!isAvailable}
                        onPress={() => onSelect?.(vehicleModel)}
                    >
                        <EyeIcon size={24} />
                    </Button>
                )}
            </div>
        </CardStyled>
    )
}

export default VehicleHorizontalCard

function SpecColumn({ icon, label, value, className }: SpecItem) {
    return (
        <div
            className={cn(
                "flex flex-1 flex-col items-center gap-2 text-center lg:items-start lg:text-left",
                className
            )}
        >
            <div className="flex h-10 w-10 items-center justify-center text-emerald-600">
                {icon}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    )
}
