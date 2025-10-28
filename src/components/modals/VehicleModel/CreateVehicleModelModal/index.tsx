"use client"

import React from "react"
import { useTranslation } from "react-i18next"

import {
    ModalBodyStyled,
    ModalContentStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { useCreateVehicleModel } from "@/hooks"
import { VehicleModelCreateForm } from "./CreateVehicleForm"

type SelectOption = {
    id: string
    label: string
}

type VehicleModelCreateModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    brandOptions: SelectOption[]
    segmentOptions: SelectOption[]
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
                <ModalHeaderStyled className="flex flex-col items-center gap-2 text-center">
                    <span className="text-3xl font-semibold">{t("fleet.add_unit_title")}</span>
                    <p className="text-sm font-normal text-slate-500">
                        {t("fleet.add_unit_description")}
                    </p>
                </ModalHeaderStyled>
                <ModalBodyStyled>
                    <VehicleModelCreateForm
                        createMutation={createMutation}
                        onClose={onClose}
                        brandOptions={brandOptions}
                        segmentOptions={segmentOptions}
                        isOpen={isOpen}
                    />
                </ModalBodyStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
