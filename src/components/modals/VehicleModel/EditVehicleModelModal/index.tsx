"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { ModalBody, ModalHeader } from "@heroui/react"

import { ModalContentStyled, ModalStyled } from "@/components/styled"
import { useUpdateVehicleModel } from "@/hooks"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import {
    VehicleModelEditForm,
    VehicleModelEditFormProps
} from "./EditVehicleModelForm"

export interface VehicleModelEditModalProps
    extends Pick<
        VehicleModelEditFormProps,
        "brandOptions" | "segmentOptions" | "onUpdated"
    > {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    vehicleModel: VehicleModelViewRes
}

export function VehicleModelEditModal({
    isOpen,
    onOpenChange,
    onClose,
    vehicleModel,
    brandOptions,
    segmentOptions,
    onUpdated
}: VehicleModelEditModalProps) {
    const { t } = useTranslation()

    const updateMutation = useUpdateVehicleModel({
        onSuccess: () => {
            onUpdated?.()
            onClose()
        }
    })

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContentStyled className="w-full max-w-[760px]">
                <ModalHeader className="flex flex-col items-center text-3xl font-semibold">
                    {t("fleet.edit_unit_title")}
                </ModalHeader>
                <ModalBody>
                    <VehicleModelEditForm
                        vehicleModel={vehicleModel}
                        updateMutation={updateMutation}
                        onClose={onClose}
                        isOpen={isOpen}
                        brandOptions={brandOptions}
                        segmentOptions={segmentOptions}
                        onUpdated={onUpdated}
                    />
                </ModalBody>
            </ModalContentStyled>
        </ModalStyled>
    )
}
