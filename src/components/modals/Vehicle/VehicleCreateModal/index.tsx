"use client"
import React from "react"
import { useTranslation } from "react-i18next"
import { FormikProps } from "formik"

import {
    AutocompleteStyled,
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
import { AutocompleteItem } from "@heroui/react"
import { MapPinAreaIcon } from "@phosphor-icons/react"

type SelectOption = {
    id: string
    label: string
}

type VehicleCreateModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    stationOptions: SelectOption[]
    vehicleModelOptions: SelectOption[]
    isModelLoading?: boolean
    formik: FormikProps<CreateVehicleReq>
    isSubmitting?: boolean
}

export function VehicleCreateModal({
    isOpen,
    onOpenChange,
    onClose,
    stationOptions,
    vehicleModelOptions,
    isModelLoading,
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
                            onChange={(event) =>
                                formik.setFieldValue("licensePlate", event.target.value)
                            }
                            isInvalid={Boolean(
                                formik.touched.licensePlate && formik.errors.licensePlate
                            )}
                            errorMessage={formik.errors.licensePlate}
                            isRequired
                        />
                        <FilterTypeStyle
                            label={t("vehicle.model_name")}
                            placeholder={t("vehicle.model_name_placeholder")}
                            selectedKeys={
                                formik.values.modelId
                                    ? new Set([formik.values.modelId])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isRequired
                            isClearable={false}
                            isDisabled={isModelLoading}
                            onSelectionChange={(keys) => {
                                if (keys === "all") {
                                    return
                                }
                                const [value] = Array.from(keys)
                                formik.setFieldTouched("modelId", true, false)
                                formik.setFieldValue(
                                    "modelId",
                                    value != null ? value.toString() : ""
                                )
                            }}
                            isInvalid={Boolean(formik.touched.modelId && formik.errors.modelId)}
                            errorMessage={formik.errors.modelId}
                        >
                            {vehicleModelOptions.map((option) => (
                                <FilterTypeOption key={option.id}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                        <AutocompleteStyled
                            className="w-full"
                            label={t("vehicle.station_name")}
                            placeholder={t("vehicle.station_placeholder")}
                            items={stationOptions}
                            startContent={<MapPinAreaIcon className="text-xl" />}
                            selectedKey={formik.values.stationId || undefined}
                            onSelectionChange={(key) => {
                                const nextValue = key as string | undefined
                                formik.setFieldTouched("stationId", true, false)
                                formik.setFieldValue("stationId", nextValue ?? "")
                            }}
                            onBlur={() => formik.setFieldTouched("stationId", true, false)}
                            isInvalid={Boolean(formik.touched.stationId && formik.errors.stationId)}
                            errorMessage={formik.errors.stationId}
                            isDisabled={isSubmitting || stationOptions.length === 0}
                            isRequired
                        >
                            {stationOptions.map((option) => (
                                <AutocompleteItem key={option.id} textValue={option.label}>
                                    {option.label}
                                </AutocompleteItem>
                            ))}
                        </AutocompleteStyled>
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
