"use client";

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
import { VehicleComponentViewRes } from "@/models/component/response"

type DeleteVehicleComponentModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    isSubmitting: boolean
    component: VehicleComponentViewRes | null
    onConfirm: () => void
}

export function DeleteVehicleComponentModal(props: DeleteVehicleComponentModalProps) {
    const { t } = useTranslation()

    return (
        <ModalStyled isOpen={props.isOpen} onOpenChange={props.onOpenChange} hideCloseButton>
            <ModalContentStyled>
                <ModalHeaderStyled>{t("vehicle_component.modal_delete_title")}</ModalHeaderStyled>
                <ModalBodyStyled>
                    <p className="text-sm text-slate-600">
                        {t("vehicle_component.modal_delete_message", {
                            name: props.component?.name ?? t("vehicle_component.component")
                        })}
                    </p>
                </ModalBodyStyled>
                <ModalFooterStyled className="justify-end gap-3">
                    <ButtonStyled
                        color="secondary"
                        className="bg-slate-200 text-slate-700"
                        onPress={props.onClose}
                        isDisabled={props.isSubmitting}
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        color="danger"
                        className="bg-rose-500 text-white"
                        onPress={props.onConfirm}
                        isDisabled={props.isSubmitting}
                    >
                        {t("common.delete")}
                    </ButtonStyled>
                </ModalFooterStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
