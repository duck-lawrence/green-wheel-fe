"use client"

import React, { forwardRef, useImperativeHandle, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"

import { InputStyled, TextareaStyled } from "@/components"

export type VehicleComponentFormValues = {
  name: string
  description: string
  damageFee: string
}

export type VehicleComponentFormRef = {
  submit: () => void
  reset: () => void
}

type VehicleComponentFormProps = {
  initialValues: VehicleComponentFormValues
  onSubmit: (
    values: VehicleComponentFormValues,
    helpers: { resetForm: () => void }
  ) => void
}

const toNumberSafe = (raw: unknown): number | undefined => {
  if (raw === null || raw === undefined) return undefined
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : undefined
  const cleaned = String(raw).trim().replace(/[^0-9.-]/g, "")
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") return undefined
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : undefined
}

export const VehicleComponentForm = forwardRef<
  VehicleComponentFormRef,
  VehicleComponentFormProps
>(function VehicleComponentForm({ initialValues, onSubmit }, ref) {
  const { t } = useTranslation()

  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .trim()
          .max(100, t("vehicle_component.form_name_max"))
          .required(t("vehicle_component.form_name_required")),
        description: Yup.string()
          .trim()
          .max(255, t("vehicle_component.form_description_max"))
          .required(t("vehicle_component.form_description_required")),
        damageFee: Yup.string()
          .transform((value) => {
            const n = toNumberSafe(value)
            return typeof n === "number" ? String(n) : value
          })
          .test(
            "is-valid-number",
            t("vehicle_component.form_damage_fee_required"),
            (value) => toNumberSafe(value) !== undefined
          )
          .test(
            "positive",
            t("vehicle_component.form_damage_fee_positive"),
            (value) => {
              const n = toNumberSafe(value)
              return n === undefined ? false : n > 0
            }
          )
          .required(t("vehicle_component.form_damage_fee_required"))
      }),
    [t]
  )

  const formik = useFormik<VehicleComponentFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, { resetForm })
    }
  })

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    submitForm,
    resetForm
  } = formik

  useImperativeHandle(
    ref,
    () => ({
      submit: () => submitForm(),
      reset: () => resetForm()
    }),
    [submitForm, resetForm]
  )

  return (
    <form onSubmit={formik.handleSubmit} className="contents">
      <InputStyled
        name="name"
        label={t("vehicle_component.form_name_label")}
        placeholder={t("vehicle_component.form_name_placeholder")}
        value={values.name ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={Boolean(touched.name && errors.name)}
        errorMessage={touched.name ? errors.name : undefined}
      />

      <TextareaStyled
        name="description"
        minRows={2}
        label={t("vehicle_component.form_description_label")}
        placeholder={t("vehicle_component.form_description_placeholder")}
        value={values.description ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={Boolean(touched.description && errors.description)}
        errorMessage={touched.description ? errors.description : undefined}
      />

      <InputStyled
        name="damageFee"
        type="number"
        inputMode="decimal"
        label={t("vehicle_component.form_damage_fee_label")}
        placeholder={t("vehicle_component.form_damage_fee_placeholder")}
        value={values.damageFee ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={Boolean(touched.damageFee && errors.damageFee)}
        errorMessage={touched.damageFee ? errors.damageFee : undefined}
      />
    </form>
  )
})




