"use client"
import React from "react"
import { useTranslation } from "react-i18next"
import { FormikProps } from "formik"

import {
    ButtonStyled,
    FilterTypeOption,
    FilterTypeStyle,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { CreateVehicleReq } from "@/models/vehicle/schema/request"

type SelectOption = {
    id: string
    label: string
}

type VehicleCreateModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    stationOptions: SelectOption[]
    formik: FormikProps<CreateVehicleReq>
    isSubmitting?: boolean
}

export function VehicleCreateModal({
    isOpen,
    onOpenChange,
    onClose,
    stationOptions,
    formik,
    isSubmitting
}: VehicleCreateModalProps) {
    const { t } = useTranslation()

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-2xl">
            <ModalContentStyled>
                <ModalHeaderStyled>{t("admin.vehicle_create_title")}</ModalHeaderStyled>
                <form onSubmit={formik.handleSubmit}>
                    <ModalBodyStyled>
                        <InputStyled
                            label={t("vehicle.license_plate")}
                            placeholder={t("vehicle.license_plate_placeholder")}
                            value={formik.values.licensePlate}
                            onChange={(event) => formik.setFieldValue("licensePlate", event.target.value)}
                            isInvalid={Boolean(formik.touched.licensePlate && formik.errors.licensePlate)}
                            errorMessage={formik.errors.licensePlate}
                            isRequired
                        />
                        <InputStyled
                            label={t("vehicle.model_id")}
                            placeholder={t("vehicle.model_id_placeholder")}
                            value={formik.values.modelId}
                            onChange={(event) => formik.setFieldValue("modelId", event.target.value)}
                            isInvalid={Boolean(formik.touched.modelId && formik.errors.modelId)}
                            errorMessage={formik.errors.modelId}
                        />
                        {/*
                        <FilterTypeStyle
                            label={t("vehicle.model_name")}
                            placeholder={t("vehicle.model_name_placeholder")}
                            selectedKeys={
                                formik.values.modelId ? new Set([formik.values.modelId]) : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={(keys) => {
                                if (keys === "all") {
                                    formik.setFieldValue("modelId", "")
                                    return
                                }
                                const [value] = Array.from(keys)
                                formik.setFieldValue("modelId", value != null ? value.toString() : "")
                            }}
                            isInvalid={Boolean(formik.touched.modelId && formik.errors.modelId)}
                            errorMessage={formik.errors.modelId}
                        >
                            {vehicleModelOptions.map((option) => (
                                <FilterTypeOption key={option.id}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                        */}
                        <FilterTypeStyle
                            label={t("vehicle.station_name")}
                            placeholder={t("vehicle.station_placeholder")}
                            selectedKeys={
                                formik.values.stationId ? new Set([formik.values.stationId]) : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable={false}
                            onSelectionChange={(keys) => {
                                const [value] = Array.from(keys)
                                formik.setFieldValue("stationId", value != null ? value.toString() : "")
                            }}
                            isInvalid={Boolean(formik.touched.stationId && formik.errors.stationId)}
                            errorMessage={formik.errors.stationId}
                        >
                            {stationOptions.map((option) => (
                                <FilterTypeOption key={option.id}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
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
                            type="submit"
                            color="primary"
                            isDisabled={isSubmitting}
                            className="bg-primary text-white"
                        >
                            {t("common.create")}
                        </ButtonStyled>
                    </ModalFooterStyled>
                </form>
            </ModalContentStyled>
        </ModalStyled>
    )
}

type VehicleEditModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    stationOptions: SelectOption[]
    statusOptions: { key: string; label: string }[]
    formik: FormikProps<{
        licensePlate: string
        stationId: string
        modelId: string
        status: string | null
    }>
    isSubmitting?: boolean
}

export function VehicleEditModal({
    isOpen,
    onOpenChange,
    onClose,
    stationOptions,
    statusOptions,
    formik,
    isSubmitting
}: VehicleEditModalProps) {
    const { t } = useTranslation()

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-2xl">
            <ModalContentStyled>
                <ModalHeaderStyled>{t("admin.vehicle_edit_title")}</ModalHeaderStyled>
                <form onSubmit={formik.handleSubmit}>
                    <ModalBodyStyled>
                        <InputStyled
                            label={t("vehicle.license_plate")}
                            value={formik.values.licensePlate}
                            onChange={(event) => formik.setFieldValue("licensePlate", event.target.value)}
                            isInvalid={Boolean(formik.touched.licensePlate && formik.errors.licensePlate)}
                            errorMessage={formik.errors.licensePlate}
                            isRequired
                        />
                        <InputStyled
                            label={t("vehicle.model_id")}
                            value={formik.values.modelId}
                            onChange={(event) => formik.setFieldValue("modelId", event.target.value)}
                            errorMessage={formik.errors.modelId}
                        />
                        <FilterTypeStyle
                            label={t("vehicle.station_name")}
                            selectedKeys={
                                formik.values.stationId ? new Set([formik.values.stationId]) : new Set([])
                            }
                            disallowEmptySelection={false}
                            onSelectionChange={(keys) => {
                                const [value] = Array.from(keys)
                                formik.setFieldValue("stationId", value != null ? value.toString() : "")
                            }}
                            isInvalid={Boolean(formik.touched.stationId && formik.errors.stationId)}
                            errorMessage={formik.errors.stationId}
                        >
                            {stationOptions.map((option) => (
                                <FilterTypeOption key={option.id}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                        <FilterTypeStyle
                            label={t("vehicle.status_label")}
                            selectedKeys={
                                formik.values.status ? new Set([formik.values.status]) : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={(keys) => {
                                if (keys === "all") {
                                    formik.setFieldValue("status", null)
                                    return
                                }
                                const [value] = Array.from(keys)
                                formik.setFieldValue("status", value != null ? value.toString() : null)
                            }}
                            errorMessage={formik.errors.status ?? undefined}
                        >
                            {statusOptions.map((option) => (
                                <FilterTypeOption key={option.key}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
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
                            type="submit"
                            color="primary"
                            isDisabled={isSubmitting}
                            className="bg-primary text-white"
                        >
                            {t("common.update")}
                        </ButtonStyled>
                    </ModalFooterStyled>
                </form>
            </ModalContentStyled>
        </ModalStyled>
    )
}
