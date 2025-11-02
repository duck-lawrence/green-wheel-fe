"use client";

import React, { useMemo, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"
import {
  ButtonStyled,
  ModalBodyStyled,
  ModalContentStyled,
  ModalFooterStyled,
  ModalHeaderStyled,
  ModalStyled
} from "@/components"
import { UpdateVehicleComponentReq } from "@/models/component/request"
import { VehicleComponentViewRes } from "@/models/component/response"
import {
  VehicleComponentForm,
  VehicleComponentFormRef,
  VehicleComponentFormValues
} from "../VehicleComponentForm"

type EditVehicleComponentModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  isSubmitting: boolean
  component: VehicleComponentViewRes | null
  onSubmit: (payload: UpdateVehicleComponentReq) => void
}

const toNumber = (raw: unknown) => {
  if (raw === null || raw === undefined) return NaN
  return Number(String(raw).replace(/,/g, ""))
}

export function EditVehicleComponentModal(props: EditVehicleComponentModalProps) {
  const { t } = useTranslation()
  const formRef = useRef<VehicleComponentFormRef>(null)

  const initialValues = useMemo<VehicleComponentFormValues>(() => {
    if (!props.component) {
      return { name: "", description: "", damageFee: "" }
    }
    return {
      name: props.component.name,
      description: props.component.description,
      damageFee: props.component.damageFee.toString()
    }
  }, [props.component])

  const handleSubmit = useCallback(
    (values: VehicleComponentFormValues) => {
      if (!props.component) return

      const trimmedName = values.name.trim()
      const trimmedDescription = values.description.trim()
      const damageFeeNumber = toNumber(values.damageFee)
      if (!Number.isFinite(damageFeeNumber) || damageFeeNumber <= 0) {
        return
      }

      const payload: UpdateVehicleComponentReq = {}

      if (trimmedName && trimmedName !== props.component.name) {
        payload.name = trimmedName
      }
      if (trimmedDescription && trimmedDescription !== props.component.description) {
        payload.description = trimmedDescription
      }
      if (!Number.isNaN(damageFeeNumber) && damageFeeNumber !== props.component.damageFee) {
        payload.damageFee = damageFeeNumber
      }

      if (Object.keys(payload).length === 0) {
        props.onClose()
        return
      }

      props.onSubmit(payload)
    },
    [props]
  )

  return (
    <ModalStyled isOpen={props.isOpen} onOpenChange={props.onOpenChange} hideCloseButton>
      <ModalContentStyled>
        <ModalHeaderStyled>{t("vehicle_component.modal_edit_title")}</ModalHeaderStyled>

        <ModalBodyStyled>
          <VehicleComponentForm
            ref={formRef}
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          />
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
            color="primary"
            className="bg-emerald-500 text-white"
            onPress={() => formRef.current?.submit()}
            isDisabled={props.isSubmitting || !props.component}
          >
            {t("common.update")}
          </ButtonStyled>
        </ModalFooterStyled>
      </ModalContentStyled>
    </ModalStyled>
  )
}
