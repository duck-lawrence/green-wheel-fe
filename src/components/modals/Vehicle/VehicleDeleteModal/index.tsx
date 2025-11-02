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

type StationNameMap = Record<string, string>

type VehicleDeleteModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  vehicle: {
    id: string
    licensePlate: string
    stationId: string
  } | null
  stationNameById: StationNameMap
  isSubmitting?: boolean
  onConfirm: () => void
}

export function VehicleDeleteModal({
  isOpen,
  onOpenChange,
  onClose,
  vehicle,
  stationNameById,
  isSubmitting = false,
  onConfirm
}: VehicleDeleteModalProps) {
  const { t } = useTranslation()

  return (
    <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-md">
      <ModalContentStyled>
        <ModalHeaderStyled>{t("admin.vehicle_delete_title")}</ModalHeaderStyled>

        <ModalBodyStyled>
          <p className="text-sm text-slate-600">{t("admin.vehicle_delete_confirm")}</p>

          <div className="rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold">{t("vehicle.license_plate")}:</span>{" "}
              {vehicle?.licensePlate ?? "-"}
            </p>

            <p>
              <span className="font-semibold">{t("vehicle.station_name")}:</span>{" "}
              {vehicle ? (stationNameById[vehicle.stationId] ?? vehicle.stationId) : "-"}
            </p>
          </div>
        </ModalBodyStyled>

        <ModalFooterStyled className="gap-3">
          <ButtonStyled
            type="button"
            color="secondary"
            onPress={onClose}
            className="bg-slate-200 text-slate-700"
          >
            {t("common.cancel")}
          </ButtonStyled>

          <ButtonStyled
            type="button"
            color="danger"
            onPress={onConfirm}
            isDisabled={isSubmitting}
            className="bg-rose-500 text-white"
          >
            {t("common.delete")}
          </ButtonStyled>
        </ModalFooterStyled>
      </ModalContentStyled>
    </ModalStyled>
  )
}
