"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import type { Selection } from "@heroui/react"
import { useTranslation } from "react-i18next"
import VehicleHorizontalCard from "@/components/modules/VehicleHorizontalCard"
import {
    ButtonStyled,
    FilterTypeOption,
    FilterTypeStyle,
    PaginationStyled,
    SearchStyle
} from "@/components"
import {
    VehicleModelImageRes,
    VehicleModelViewRes
} from "@/models/vehicle/schema/response"
import { useGetAllVehicleModels, useGetAllVehicleSegments } from "@/hooks"
import { FunnelSimple } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

const DEFAULT_PAGE_SIZE = 10

export default function AdminFleetPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [carType, setCarType] = useState<string | undefined>()
    const [status, setStatus] = useState<string | undefined>()

    const {
        data: vehicleModelsData,
        isLoading: isModelsLoading,
        isFetching: isModelsFetching
    } = useGetAllVehicleModels()
    const { data: segmentData = [] } = useGetAllVehicleSegments()

    const vehicleModels = useMemo<VehicleModelViewRes[]>(() => {
        return (vehicleModelsData ?? []).map((model) => {
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

    const statusOptions = useMemo(
        () => [
            { key: "available", label: t("fleet.status_available") },
            { key: "out_of_stock", label: t("fleet.status_out_of_stock") }
        ],
        [t]
    )

    const carTypeOptions = useMemo(() => {
        if (segmentData.length > 0) {
            return segmentData.map((segment) => ({
                key: segment.id,
                label: segment.name
            }))
        }

        const uniqueSegments = new Map<string, string>()
        vehicleModels.forEach((model) => {
            const segmentId = model.segment?.id
            if (segmentId) {
                uniqueSegments.set(segmentId, model.segment.name)
            }
        })

        return Array.from(uniqueSegments.entries()).map(([key, label]) => ({
            key,
            label
        }))
    }, [segmentData, vehicleModels])

    const normalizedSearch = useMemo(
        () => searchTerm.trim().toLowerCase(),
        [searchTerm]
    )

    const filteredVehicles = useMemo(() => {
        return vehicleModels.filter((model) => {
            const matchesSearch =
                !normalizedSearch ||
                [
                    model.name,
                    model.brand?.name ?? "",
                    model.segment?.name ?? ""
                ]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(normalizedSearch))

            const matchesCarType = !carType || model.segment?.id === carType

            const matchesStatus =
                !status ||
                (status === "available"
                    ? model.availableVehicleCount > 0
                    : model.availableVehicleCount === 0)

            return matchesSearch && matchesCarType && matchesStatus
        })
    }, [vehicleModels, normalizedSearch, carType, status])

    const totalVehicles = filteredVehicles.length
    const totalPages = Math.max(1, Math.ceil(totalVehicles / DEFAULT_PAGE_SIZE))

    useEffect(() => {
        setPage(1)
    }, [normalizedSearch, carType, status])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const currentPage = Math.min(Math.max(page, 1), totalPages)

    const currentVehicles = useMemo(() => {
        if (totalVehicles === 0) return []
        const start = (currentPage - 1) * DEFAULT_PAGE_SIZE
        return filteredVehicles.slice(start, start + DEFAULT_PAGE_SIZE)
    }, [filteredVehicles, currentPage, totalVehicles])

    const handleCarTypeChange = (keys: Selection) => {
        if (keys === "all") {
            setCarType(undefined)
            return
        }
        const [value] = Array.from(keys)
        setCarType(value != null ? value.toString() : undefined)
    }

    const handleStatusChange = (keys: Selection) => {
        if (keys === "all") {
            setStatus(undefined)
            return
        }
        const [value] = Array.from(keys)
        setStatus(value != null ? value.toString() : undefined)
    }

    const handleVehicleSelect = useCallback(
        (vehicleModel: VehicleModelViewRes) => {
            router.push(`/dashboard/fleet/${vehicleModel.id}`)
        },
        [router]
    )

    const handlePageChange = (nextPage: number) => {
        setPage(Math.min(Math.max(nextPage, 1), totalPages))
    }

    const isLoading = isModelsLoading || isModelsFetching

    return (
        <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm mb-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">
                    {t("fleet.page_title")}
                </h1>
                <p className="text-sm text-slate-500">
                    {t("fleet.page_subtitle")}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-slate-700">
                    <FunnelSimple size={22} className="text-primary" />
                    <h2 className="text-lg font-semibold">{t("fleet.filter_title")}</h2>
                </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                        <SearchStyle
                            placeholder={t("fleet.search_placeholder")}
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            className="sm:w-60 lg:w-72"
                            isClearable
                        />
                        <FilterTypeStyle
                            placeholder={t("fleet.filter_car_type")}
                            selectedKeys={carType ? new Set([carType]) : new Set<string>()}
                            onSelectionChange={handleCarTypeChange}
                            className="sm:w-44"
                            isDisabled={carTypeOptions.length === 0}
                            isClearable
                        >
                            {carTypeOptions.map((option) => (
                                <FilterTypeOption key={option.key}>
                                    {option.label}
                                </FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                        <FilterTypeStyle
                            placeholder={t("fleet.filter_status")}
                            selectedKeys={status ? new Set([status]) : new Set<string>()}
                            onSelectionChange={handleStatusChange}
                            className="sm:w-40"
                            isClearable
                        >
                            {statusOptions.map((option) => (
                                <FilterTypeOption key={option.key}>
                                    {option.label}
                                </FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <ButtonStyled
                            color="danger"
                            radius="lg"
                            className="h-12 px-5 font-semibold sm:ml-3 sm:shrink-0"
                        >
                            {t("fleet.add_unit_button")}
                        </ButtonStyled>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                {isLoading ? (
                    <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">
                        {t("fleet.loading")}
                    </div>
                ) : currentVehicles.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-4">
                            {currentVehicles.map((vehicle) => (
                                <VehicleHorizontalCard
                                    key={vehicle.id}
                                    vehicleModel={vehicle}
                                    readOnly={false}
                                    onSelect={handleVehicleSelect}
                                />
                            ))}
                        </div>

                        {totalVehicles > DEFAULT_PAGE_SIZE ? (
                            <div className="flex justify-center pt-2">
                                <PaginationStyled
                                    pageNumber={currentPage}
                                    pageSize={DEFAULT_PAGE_SIZE}
                                    totalItems={totalVehicles}
                                    onPageChange={handlePageChange}
                                    showControls
                                />
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">
                        {t("fleet.empty_state")}
                    </div>
                )}
            </section>
        </div>
    )
}
