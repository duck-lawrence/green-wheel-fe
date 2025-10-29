"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { ModalBody, ModalHeader } from "@heroui/react"

import { ModalContentStyled, ModalStyled } from "@/components/styled"
import { useCreateVehicleModel } from "@/hooks"
import {
    VehicleModelCreateForm,
    VehicleModelCreateFormProps
} from "./CreateVehicleModelForm"

export interface VehicleModelCreateModalProps
    extends Pick<
        VehicleModelCreateFormProps,
        "brandOptions" | "segmentOptions"
    > {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    onCreated?: () => void
}

export function VehicleModelCreateModal({
    isOpen,
    onOpenChange,
    onClose,
    brandOptions,
    segmentOptions,
    onCreated
}: VehicleModelCreateModalProps) {
    const { t } = useTranslation()

    const createMutation = useCreateVehicleModel({
        onSuccess: () => {
            onCreated?.()
            onClose()
        }
    })

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContentStyled className="w-full max-w-[760px]">
                <ModalHeader className="flex flex-col items-center text-3xl font-semibold">
                    {t("fleet.add_unit_title")}
                </ModalHeader>
                <ModalBody>
                    <VehicleModelCreateForm
                        createMutation={createMutation}
                        onClose={onClose}
                        brandOptions={brandOptions}
                        segmentOptions={segmentOptions}
                        isOpen={isOpen}
                    />
                </ModalBody>
            </ModalContentStyled>
        </ModalStyled>
    )
}
