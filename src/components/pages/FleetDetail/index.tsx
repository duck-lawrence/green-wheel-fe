"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next"

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

import { useDay, useGetAllBrandes, useGetAllVehicleSegments } from "@/hooks"

import { DATE_TIME_VIEW_FORMAT, DEFAULT_VEHICLE_MODEL } from "@/constants/constants"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

import { TableFleetVehicle, VehicleRow } from "./TableFleetVehicle"
import { TableFleetComponent } from "./TableFleetComponent"
import { mapVehiclesToRows, TranslateFn, useApiErrorToasts, useFleetData } from "./helper"

export function AdminFleetDetail({ modelId }: { modelId: string }) {
    const router = useRouter()
    const { t } = useTranslation()

    const translate = useCallback<TranslateFn>(
        (key, fallback) => translateWithFallback(t, key, fallback),
        [t]
    )

    const { formatDateTime } = useDay({
        defaultFormat: DATE_TIME_VIEW_FORMAT
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
        refetchVehicleModels,
        refetchComponents
    } = useFleetData(modelId)

    const { data: brands = [] } = useGetAllBrandes()

    const brandOptions = useMemo(() => {
        return brands.map((brand) => ({
            id: brand.id,
            label: brand.name
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
    }, [vehicleSegments, vehicleModel?.segment?.id, vehicleModel?.segment?.name])

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
    useApiErrorToasts([vehicleModelsError, vehiclesError, componentsError, stationsError], t)

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
                hasStock ? "fleet.status_available" : "fleet.status_unavailable",
                hasStock ? "Available" : "Unavailable"
            ),
            isAvailable: hasStock
        }
    }, [vehicleModel, translate])
    const { label: availabilityLabel, isAvailable } = availabilityInfo

    // images for gallery
    const modelImages = useMemo(() => {
        if (!vehicleModel) return [DEFAULT_VEHICLE_MODEL]
        const images = [vehicleModel.imageUrl, ...(vehicleModel.imageUrls ?? [])].filter(
            (src): src is string => Boolean(src)
        )
        return images.length > 0 ? images : [DEFAULT_VEHICLE_MODEL]
    }, [vehicleModel])

    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        setActiveImage(0)
    }, [vehicleModel?.id])

    useEffect(() => {
        if (activeImage >= modelImages.length) {
            setActiveImage(0)
        }
    }, [activeImage, modelImages])

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

                <ButtonStyled color="primary" onPress={() => router.push("/dashboard/fleet")}>
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
                subImgUrls={modelImages}
                activeImage={activeImage}
                onSelectImage={setActiveImage}
                onEdit={onEditModalOpen}
                onDelete={onDeleteModalOpen}
            />

            <FleetSpecSection vehicleModel={vehicleModel} />

            <TableFleetVehicle rows={vehicleRows} isLoading={isFetchingVehicles} />

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
