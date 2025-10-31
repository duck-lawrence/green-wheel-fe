"use client"

import React from "react"
import { useTranslation } from "react-i18next"

import {
    ButtonStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { useDeleteVehicleModel } from "@/hooks"

type VehicleModelDeleteModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    modelName: string
    vehicleCount: number
    modelId: string
    onDeleted?: () => void
}

export function VehicleModelDeleteModal({
    isOpen,
    onOpenChange,
    onClose,
    modelName,
    vehicleCount,
    modelId,
    onDeleted
}: VehicleModelDeleteModalProps) {
    const { t } = useTranslation()

    const deleteMutation = useDeleteVehicleModel({
        onSuccess: () => {
            onDeleted?.()
            onClose()
        }
    })

    const isDeleteDisabled = deleteMutation.isPending || vehicleCount > 0

    const handleConfirmDelete = () => {
        if (isDeleteDisabled) return
        deleteMutation.mutate(modelId)
    }

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-md">
                <ModalContentStyled>
                    <ModalHeaderStyled className="text-xl font-semibold text-slate-900">
                        {t("fleet.delete_model_title")}
                    </ModalHeaderStyled>
                    <ModalBodyStyled className="space-y-4 text-sm text-slate-600">
                        <p>{t("fleet.delete_model_confirm", { name: modelName })}</p>
                        
                           
                       {vehicleCount > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                            <p>
                            {t("fleet.delete_model_vehicle_warning", { count: vehicleCount })}
                            </p>
                            <p className="mt-2 font-semibold text-amber-800">
                            {t("fleet.delete_model_blocked")}
                            </p>
                        </div>
                        )}
                    </ModalBodyStyled>
                    <ModalFooterStyled className="justify-end gap-3">
                        <ButtonStyled
                            color="secondary"
                            className="bg-slate-200 text-slate-700"
                            onPress={onClose}
                            isDisabled={deleteMutation.isPending}
                        >
                            {t("common.cancel")}
                        </ButtonStyled>
                        <ButtonStyled
                            color="danger"
                            className="bg-rose-500 text-white"
                            onPress={handleConfirmDelete}
                            isDisabled={isDeleteDisabled}
                        >
                            {vehicleCount > 0
                                ? t("common.delete")
                                : t("common.delete")}
                        </ButtonStyled>
                    </ModalFooterStyled>
                </ModalContentStyled>
        </ModalStyled>
    )
}
