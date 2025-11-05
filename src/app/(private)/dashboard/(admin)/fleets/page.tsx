"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AutocompleteItem } from "@heroui/react"
import { useTranslation } from "react-i18next"
import VehicleHorizontalCard from "@/components/modules/VehicleHorizontalCard"
import {
    AutocompleteStyled,
    ButtonStyled,
    SearchStyle,
    SpinnerStyled,
    VehicleModelCreateModal
} from "@/components"
import { useGetAllBrandes, useGetAllVehicleModels, useGetAllVehicleSegments } from "@/hooks"
import { FunnelSimple } from "@phosphor-icons/react"
import { GetAllModelParams } from "@/models/vehicle/schema/request"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { useRouter } from "next/navigation"
import { addToast } from "@heroui/toast"
import { PlusCircle } from "lucide-react"

export default function AdminFleetPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<GetAllModelParams>({
        name: undefined,
        segmentId: undefined
    })

    const [vehicleModels, setVehicleModels] = useState<VehicleModelViewRes[]>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const {
        isLoading: isModelsLoading,
        isFetching: isModelsFetching,
        refetch: refetchModels
    } = useGetAllVehicleModels({ query: filter })
    const { data: brands = [] } = useGetAllBrandes()
    const {
        data: vehicleSegments,
        isLoading: isGetVehicleSegmentsLoading,
        error: getVehicleSegmentsError
    } = useGetAllVehicleSegments()

    const segmentOptions = useMemo(
        () =>
            (vehicleSegments ?? [])
                .map((segment) => ({
                    id: segment.id,
                    label: segment.name
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [vehicleSegments]
    )

    const brandOptions = useMemo(() => {
        return brands.map((brand) => ({
            id: brand.id,
            label: brand.name,
            description: brand.description,
            country: brand.country,
            foundedYear: brand.foundedYear
        }))
    }, [brands])

    const filteredVehicles = useMemo(() => {
        // Status filtering moved out; backend handles status when re-enabled.
        return vehicleModels ?? []
    }, [vehicleModels])

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
        setFilter((prev) => {
            const nextName = value.trim() ? value.trim() : undefined
            if (prev.name === nextName) return prev
            return {
                ...prev,
                name: nextName
            }
        })
    }, [])

    // Load segment
    useEffect(() => {
        if (getVehicleSegmentsError) {
            const error = getVehicleSegmentsError as BackendError
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    }, [getVehicleSegmentsError, t])

    // load models
    const refreshVehicleModels = useCallback(async () => {
        try {
            const { data } = await refetchModels()
            setVehicleModels(data || [])
        } catch (error) {
            const backendError = error as BackendError
            addToast({
                title: backendError.title || t("toast.error"),
                description: translateWithFallback(t, backendError.detail),
                color: "danger"
            })
        }
    }, [refetchModels, t])

    useEffect(() => {
        refreshVehicleModels()
    }, [filter, refreshVehicleModels])

    const handleCreateModalOpen = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

    const handleCreateModalClose = useCallback(() => {
        setIsCreateModalOpen(false)
    }, [])

    const handleCreateModalChange = useCallback((open: boolean) => {
        setIsCreateModalOpen(open)
    }, [])

    const handleVehicleModelCreated = useCallback(() => {
        void refreshVehicleModels()
    }, [refreshVehicleModels])

    const isLoading = isModelsLoading || isModelsFetching

    const handleVehicleSelect = useCallback(
        (vehicleModel: VehicleModelViewRes) => {
            router.push(`/dashboard/fleets/${vehicleModel.id}`)
        },
        [router]
    )

    if (isGetVehicleSegmentsLoading || getVehicleSegmentsError) return <SpinnerStyled />

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-slate-900">{t("fleet.page_title")}</h1>

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
                            onValueChange={handleSearchChange}
                            className="sm:w-60 lg:w-72"
                            isClearable
                        />

                        <AutocompleteStyled
                            placeholder={t("vehicle_model.segment")}
                            variant="bordered"
                            items={vehicleSegments}
                            selectedKey={filter.segmentId}
                            onSelectionChange={async (id) => {
                                setFilter({ ...filter, segmentId: id as string | undefined })
                            }}
                            className="sm:w-44 bg-white"
                            inputProps={{
                                classNames: {
                                    inputWrapper: "min-h-12"
                                }
                            }}
                        >
                            {(vehicleSegments ?? []).map((item) => (
                                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                            ))}
                        </AutocompleteStyled>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <ButtonStyled
                            onPress={handleCreateModalOpen}
                            className="btn-gradient  h-12 px-5 font-semibold text-white sm:ml-3 sm:shrink-0"
                        >
                            <PlusCircle size={18} /> {t("fleet.add_unit_button")}
                        </ButtonStyled>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                {isLoading || !filteredVehicles ? (
                    <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">
                        {t("fleet.loading")}
                    </div>
                ) : filteredVehicles.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-4">
                            {filteredVehicles.map((vehicle) => (
                                <VehicleHorizontalCard
                                    key={vehicle.id}
                                    vehicleModel={vehicle}
                                    onSelect={handleVehicleSelect}
                                    readOnly={false}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">
                        {t("fleet.empty_state")}
                    </div>
                )}
            </section>

            <VehicleModelCreateModal
                isOpen={isCreateModalOpen}
                onOpenChange={handleCreateModalChange}
                onClose={handleCreateModalClose}
                brandOptions={brandOptions}
                segmentOptions={segmentOptions}
                onCreated={handleVehicleModelCreated}
            />
        </div>
    )
}
