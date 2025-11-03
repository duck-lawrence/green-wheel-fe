"use client"

import React from "react"
import {
    BatteryCharging,
    FlagCheckered,
    Gauge,
    RoadHorizon,
    ShieldCheck,
    UsersFour
} from "@phosphor-icons/react"

import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { useTranslation } from "react-i18next"

type FleetSpecSectionProps = {
    vehicleModel: VehicleModelViewRes
}

export function FleetSpecSection({ vehicleModel }: FleetSpecSectionProps) {
    const { t } = useTranslation()

    const unknown = t("fleet.detail_unknown")

    const pretty = (value?: number | string | null, unit?: string): string => {
        if (value === undefined || value === null || value === "") {
            return unknown
        }

        return unit ? `${value} ${unit}` : `${value}`
    }

    const items = [
        {
            key: "capacity",
            label: t("fleet.spec_capacity"),
            value: pretty(vehicleModel.seatingCapacity, t("fleet.detail_seats_unit")),
            icon: <UsersFour size={18} weight="duotone" />
        },
        {
            key: "motorPower",
            label: t("fleet.spec_motor_power"),
            value: pretty(vehicleModel.motorPower, t("fleet.detail_kw_unit")),
            icon: <Gauge size={18} weight="duotone" />
        },
        {
            key: "batteryCapacity",
            label: t("fleet.spec_battery"),
            value: pretty(vehicleModel.batteryCapacity, t("fleet.detail_kwh_unit")),
            icon: <BatteryCharging size={18} weight="duotone" />
        },
        {
            key: "ecoRangeKm",
            label: t("fleet.spec_eco_range"),
            value: pretty(vehicleModel.ecoRangeKm, t("fleet.detail_km_unit")),
            icon: <RoadHorizon size={18} weight="duotone" />
        },
        {
            key: "sportRangeKm",
            label: t("fleet.spec_sport_range"),
            value: pretty(vehicleModel.sportRangeKm, t("fleet.detail_km_unit")),
            icon: <FlagCheckered size={18} weight="duotone" />
        },
        {
            key: "numberOfAirbags",
            label: t("fleet.spec_airbags"),
            value: pretty(vehicleModel.numberOfAirbags, t("fleet.detail_airbags_unit")),
            icon: <ShieldCheck size={18} weight="duotone" />
        }
    ]

    return (
        <section className="space-y-3">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-950">
                {t("fleet.detail_spec_title")}
            </h2>

            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
