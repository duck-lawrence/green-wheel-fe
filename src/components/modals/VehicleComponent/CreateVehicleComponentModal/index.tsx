"use client"

import React, { useEffect, useRef, useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  ButtonStyled,
  ModalBodyStyled,
  ModalContentStyled,
  ModalFooterStyled,
  ModalHeaderStyled,
  ModalStyled,
} from "@/components"

import { CreateVehicleComponentReq } from "@/models/component/request"
import {
  VehicleComponentForm,
  VehicleComponentFormRef,
  VehicleComponentFormValues
} from "../VehicleComponentForm"

type CreateVehicleComponentModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  isSubmitting: boolean
  onSubmit: (payload: CreateVehicleComponentReq) => void
}

const toNumber = (raw: unknown) => {
  if (raw === null || raw === undefined) return NaN
  return Number(String(raw).replace(/,/g, ""))
}

export function CreateVehicleComponentModal(props: CreateVehicleComponentModalProps) {
  const { t } = useTranslation()
  const formRef = useRef<VehicleComponentFormRef>(null)
  const wasOpenRef = useRef(false)

  const initialValues = useMemo<VehicleComponentFormValues>(
    () => ({ name: "", description: "", damageFee: "" }),
    []
  )

  useEffect(() => {
    if (wasOpenRef.current && !props.isOpen) {
      formRef.current?.reset()
    }
    wasOpenRef.current = props.isOpen
  }, [props.isOpen])

  return (
    <ModalStyled isOpen={props.isOpen} onOpenChange={props.onOpenChange} hideCloseButton>
      <ModalContentStyled>
        <ModalHeaderStyled>{t("vehicle_component.modal_create_title")}</ModalHeaderStyled>

        <ModalBodyStyled>
          <VehicleComponentForm
            ref={formRef}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              const damageFee = toNumber(values.damageFee)
              if (!Number.isFinite(damageFee) || damageFee <= 0) {
                return
              }

              const payload: CreateVehicleComponentReq = {
                name: values.name.trim(),
                description: values.description.trim(),
                damageFee,
              }
              props.onSubmit(payload)
              resetForm()
            }}
          />
        </ModalBodyStyled>

        <ModalFooterStyled className="justify-end gap-3">
          <ButtonStyled
            color="secondary"
            className="bg-slate-200 text-slate-700"
            onPress={() => {
              props.onClose()
              formRef.current?.reset()
            }}
            isDisabled={props.isSubmitting}
          >
            {t("common.cancel")}
          </ButtonStyled>

          <ButtonStyled
            color="primary"
            className="bg-emerald-500 text-white"
            onPress={() => formRef.current?.submit()}
            isDisabled={props.isSubmitting}
          >
            {t("common.create")}
          </ButtonStyled>
        </ModalFooterStyled>
      </ModalContentStyled>
    </ModalStyled>
  )
}

