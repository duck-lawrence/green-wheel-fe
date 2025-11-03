"use client"

import React from "react"
import Image from "next/image"
import { CheckCircle, PencilSimple, TrashSimple } from "@phosphor-icons/react"

import { ButtonStyled, VehicleSubImagesScroll } from "@/components"
import { DEFAULT_VEHICLE_MODEL } from "@/constants/constants"
import { formatCurrency } from "@/utils/helpers/currency"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"

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
        <section className="space-y-6 bg-white">
            <div className="space-y-6">
                <div className="w-full">
                    <div className="mx-auto w-full max-w-xl">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                            <Image
                                src={subImgUrls[activeImage] ?? DEFAULT_VEHICLE_MODEL}
                                alt={vehicleModel.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 640px"
                                className="object-cover"
                                priority
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
                                {vehicleModel.segment?.name ?? t("fleet.detail_segment")}
                            </span>

                            <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${availabilityBadgeClasses}`}
                            >
                                {isAvailable && <CheckCircle size={14} weight="bold" />}
                                {availabilityLabel}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <h1 className="text-3xl/tight sm:text-4xl font-bold tracking-tight">
                                    {vehicleModel.name}
                                </h1>
                                <p className="text-3xl/tight sm:text-[2.1rem] font-semibold text-neutral-600">
                                    {`- ${vehicleModel.description}`}
                                </p>
                            </div>

                            <p className="text-sm font-medium text-slate-500">
                                {vehicleModel.brand?.name ?? t("fleet.detail_brand")}
                            </p>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t("fleet.detail_model_id")}:{" "}
                                <span className="text-slate-700">{vehicleModel.id}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 md:items-end">
                        <div className="flex items-center gap-2">
                            <ButtonStyled
                                variant="light"
                                onPress={onEdit}
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-primary"
                                startContent={<PencilSimple size={16} weight="bold" />}
                            >
                                {t("common.edit")}
                            </ButtonStyled>

                            <ButtonStyled
                                variant="light"
                                isDisabled={vehicleModel.availableVehicleCount !== 0}
                                onPress={onDelete}
                                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-rose-600"
                                startContent={<TrashSimple size={16} weight="bold" />}
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
                                    {t("vehicle_model.vnd_per_day")}
                                </span>
                            </p>

                            <div className="flex gap-2">
                                <p className="text-xs text-slate-500">
                                    {t("fleet.detail_deposit_fee")}:{" "}
                                    <strong className="text-slate-700">
                                        {formatCurrency(vehicleModel.depositFee)}
                                    </strong>
                                </p>
                                <div className="hidden md:block w-[2px] bg-default self-stretch"></div>
                                <p className="text-xs text-slate-500">
                                    {t("fleet.detail_reservation_fee")}:{" "}
                                    <strong className="text-slate-70">
                                        {formatCurrency(vehicleModel.reservationFee)}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* description */}
            {/* <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-700">{t("fleet.detail_about")}</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                    {vehicleModel.description?.trim() || t("fleet.detail_description_empty")}
                </p>
            </div> */}
        </section>
    )
}
