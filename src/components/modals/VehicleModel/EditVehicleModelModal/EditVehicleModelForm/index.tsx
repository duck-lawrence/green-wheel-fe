"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { UseMutationResult } from "@tanstack/react-query"

import {
    ButtonStyled,
    FilterTypeOption,
    FilterTypeStyle,
    InputStyled,
    ModelImagesUploader,
    ModalFooterStyled,
    TextareaStyled,
    NumberInputStyled
} from "@/components"
import { DEFAULT_VEHICLE_MODEL } from "@/constants/constants"
import { BackendError } from "@/models/common/response"
import { UpdateVehicleModelReq } from "@/models/vehicle/schema/request"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { FormSection } from "./FormSection"
import { ImagePreviewSection } from "./ImagePreviewSection"

type SelectOption = {
    id: string
    label: string
}

export interface VehicleModelEditFormProps {
    vehicleModel: VehicleModelViewRes
    updateMutation: UseMutationResult<
        void,
        BackendError,
        {
            id: string
            payload: UpdateVehicleModelReq
        }
    >
    brandOptions: SelectOption[]
    segmentOptions: SelectOption[]
    onClose: () => void
    isOpen: boolean
    onUpdated?: () => void
}

function buildInitialValues(model: VehicleModelViewRes): UpdateVehicleModelReq {
    return {
        name: model.name ?? "",
        description: model.description ?? "",
        brandId: model.brand?.id ?? "",
        segmentId: model.segment?.id ?? "",
        costPerDay: model.costPerDay != null ? model.costPerDay : 0,
        depositFee: model.depositFee != null ? model.depositFee : 0,
        reservationFee: model.reservationFee != null ? model.reservationFee : 0,
        seatingCapacity: model.seatingCapacity != null ? model.seatingCapacity : 0,
        numberOfAirbags: model.numberOfAirbags != null ? model.numberOfAirbags : 0,
        motorPower: model.motorPower != null ? model.motorPower : 0,
        batteryCapacity: model.batteryCapacity != null ? model.batteryCapacity : 0,
        ecoRangeKm: model.ecoRangeKm != null ? model.ecoRangeKm : 0,
        sportRangeKm: model.sportRangeKm != null ? model.sportRangeKm : 0
    }
}

export function VehicleModelEditForm({
    vehicleModel,
    updateMutation,
    brandOptions,
    segmentOptions,
    onClose,
    isOpen,
    onUpdated
}: VehicleModelEditFormProps) {
    const { t } = useTranslation()

    // transform helper for Yup.number() required fields
    const numericTransform = useCallback((value: unknown, originalValue: unknown) => {
        if (typeof originalValue === "string" && originalValue.trim() === "") {
            return NaN
        }
        return value
    }, [])

    const handleSubmit = useCallback(
        async (values: UpdateVehicleModelReq) => {
            await updateMutation.mutateAsync({
                id: vehicleModel.id,
                payload: values
            })
        },
        [updateMutation, vehicleModel.id]
    )

    const formik = useFormik<UpdateVehicleModelReq>({
        initialValues: buildInitialValues(vehicleModel),
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().trim().required(t("vehicle_model.name_require")),
            description: Yup.string().trim().required(t("vehicle_model.description_require")),
            brandId: Yup.string().trim().required(t("vehicle_model.brand_id_require")),
            segmentId: Yup.string().trim().required(t("vehicle_model.segment_id_require")),

            costPerDay: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.cost_per_day_require"))
                .required(t("vehicle_model.cost_per_day_require"))
                .moreThan(0, t("vehicle_model.cost_per_day_positive")),
            depositFee: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.deposit_fee_require"))
                .required(t("vehicle_model.deposit_fee_require"))
                .moreThan(0, t("vehicle_model.deposit_fee_positive")),
            reservationFee: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.reservation_fee_require"))
                .required(t("vehicle_model.reservation_fee_require"))
                .moreThan(0, t("vehicle_model.reservation_fee_positive")),
            seatingCapacity: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.seating_capacity_require"))
                .required(t("vehicle_model.seating_capacity_require"))
                .moreThan(0, t("vehicle_model.seating_capacity_can_not_negative")),

            numberOfAirbags: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.airbag_require"))
                .required(t("vehicle_model.airbag_require"))
                .moreThan(0, t("vehicle_model.airbag_can_not_negative")),

            motorPower: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.motor_power_require"))
                .required(t("vehicle_model.motor_power_require"))
                .moreThan(0, t("vehicle_model.motor_power_can_not_negative"))
                .lessThan(9999.99, t("vehicle_model.motor_power_max")),

            batteryCapacity: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.battery_capacity_require"))
                .required(t("vehicle_model.battery_capacity_require"))
                .moreThan(0, t("vehicle_model.battery_capacity_can_not_negative"))
                .lessThan(9999.99, t("vehicle_model.battery_capacity_max")),

            ecoRangeKm: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.eco_range_km_require"))
                .required(t("vehicle_model.eco_range_km_require"))
                .moreThan(0, t("vehicle_model.eco_range_km_can_not_negative")),

            sportRangeKm: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.sport_range_km_require"))
                .required(t("vehicle_model.sport_range_km_require"))
                .moreThan(0, t("vehicle_model.sport_range_km_can_not_negative"))
        }),
        onSubmit: handleSubmit
    })

    // reset everything when modal closes
    useEffect(() => {
        if (!isOpen) {
            formik.resetForm({ values: buildInitialValues(vehicleModel) })
            updateMutation.reset()
        }
    }, [isOpen, vehicleModel, formik, updateMutation])

    // image preview state
    const [activeImage, setActiveImage] = useState(0)

    const imageUrls = useMemo(() => {
        const urls = [vehicleModel.imageUrl, ...(vehicleModel.imageUrls ?? [])].filter(
            (url): url is string => Boolean(url)
        )

        return urls.length > 0 ? urls : [DEFAULT_VEHICLE_MODEL]
    }, [vehicleModel.imageUrl, vehicleModel.imageUrls])

    // whenever model changes or modal re-opens, reset active preview to first
    useEffect(() => {
        setActiveImage(0)
    }, [vehicleModel.id, isOpen])

    const isSubmitting = formik.isSubmitting || updateMutation.isPending

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            {/* IMAGE PREVIEW + UPLOAD */}
            <ImagePreviewSection
                imageUrls={imageUrls}
                activeImage={activeImage}
                onSelectImage={setActiveImage}
            >
                <ModelImagesUploader
                    id={vehicleModel.id}
                    onUploaded={onUpdated}
                    btnClassName="bg-primary text-white font-medium hover:bg-primary/90"
                />
            </ImagePreviewSection>

            {/* BASIC INFO */}
            <FormSection title={t("fleet.add_unit_section_info")}>
                <div className="grid gap-4 md:grid-cols-12">
                    {/* name */}
                    <div className="md:col-span-4">
                        <InputStyled
                            label={t("vehicle_model.name")}
                            placeholder={t("vehicle_model.name_placeholder")}
                            value={formik.values.name}
                            onValueChange={(value) => formik.setFieldValue("name", value)}
                            isInvalid={!!(formik.touched.name && formik.errors.name)}
                            errorMessage={formik.errors.name}
                            onBlur={() => formik.setFieldTouched("name")}
                            isRequired
                        />
                    </div>

                    {/* brand */}
                    <div className="md:col-span-4">
                        <FilterTypeStyle
                            className="w-full"
                            label={t("vehicle_model.brand")}
                            placeholder={t("vehicle_model.brand_placeholder")}
                            selectedKeys={
                                formik.values.brandId
                                    ? new Set([formik.values.brandId])
                                    : new Set<string>()
                            }
                            onSelectionChange={async (keys) => {
                                if (keys === "all") return
                                const [value] = Array.from(keys)
                                await formik.setFieldValue("brandId", value?.toString() ?? "")
                                formik.setFieldTouched("brandId")
                            }}
                            isInvalid={!!(formik.touched.brandId && formik.errors.brandId)}
                            errorMessage={formik.errors.brandId}
                            disallowEmptySelection={false}
                            isClearable={false}
                            isRequired
                            isDisabled={brandOptions.length === 0}
                        >
                            {brandOptions.map((option) => (
                                <FilterTypeOption key={option.id}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                    </div>

                    {/* segment */}
                    <div className="md:col-span-4">
                        <FilterTypeStyle
                            className="w-full"
                            label={t("vehicle_model.segment")}
                            placeholder={t("vehicle_model.segment_placeholder")}
                            selectedKeys={
                                formik.values.segmentId
                                    ? new Set([formik.values.segmentId])
                                    : new Set<string>()
                            }
                            onSelectionChange={async (keys) => {
                                if (keys === "all") return
                                const [value] = Array.from(keys)
                                await formik.setFieldValue("segmentId", value?.toString() ?? "")
                                formik.setFieldTouched("segmentId")
                            }}
                            isInvalid={!!(formik.touched.segmentId && formik.errors.segmentId)}
                            errorMessage={formik.errors.segmentId}
                            disallowEmptySelection={false}
                            isClearable={false}
                            isRequired
                            isDisabled={segmentOptions.length === 0}
                        >
                            {segmentOptions.map((option) => (
                                <FilterTypeOption key={option.id}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                    </div>

                    {/* description */}
                    <div className="md:col-span-12">
                        <TextareaStyled
                            minRows={3}
                            label={t("vehicle_model.description")}
                            placeholder={t("vehicle_model.description_placeholder")}
                            value={formik.values.description}
                            onValueChange={(value) => formik.setFieldValue("description", value)}
                            isInvalid={!!(formik.touched.description && formik.errors.description)}
                            errorMessage={formik.errors.description}
                            onBlur={() => formik.setFieldTouched("description")}
                            isRequired
                        />
                    </div>
                </div>
            </FormSection>

            {/* PRICING */}
            <FormSection title={t("fleet.add_unit_section_pricing")}>
                <div className="grid gap-4 md:grid-cols-12">
                    {/* costPerDay */}
                    <div className="md:col-span-6">
                        <NumberInputStyled
                            step={1}
                            min={0}
                            label={t("vehicle_model.cost_per_day")}
                            placeholder={t("vehicle_model.cost_per_day_placeholder")}
                            value={formik.values.costPerDay}
                            onValueChange={(value) => formik.setFieldValue("costPerDay", value)}
                            isInvalid={!!(formik.touched.costPerDay && formik.errors.costPerDay)}
                            errorMessage={formik.errors.costPerDay}
                            onBlur={() => formik.setFieldTouched("costPerDay")}
                            isRequired
                        />
                    </div>

                    {/* depositFee */}
                    <div className="flex gap-2 md:col-span-6">
                        <NumberInputStyled
                            step={1}
                            min={0}
                            label={t("vehicle_model.deposit_fee")}
                            placeholder={t("vehicle_model.deposit_fee_placeholder")}
                            value={formik.values.depositFee}
                            onValueChange={(value) => formik.setFieldValue("depositFee", value)}
                            isInvalid={!!(formik.touched.depositFee && formik.errors.depositFee)}
                            errorMessage={formik.errors.depositFee}
                            onBlur={() => formik.setFieldTouched("depositFee")}
                            isRequired
                        />

                        <NumberInputStyled
                            step={1}
                            min={0}
                            label={t("vehicle_model.reservation_fee")}
                            placeholder={t("vehicle_model.reservation_fee_placeholder")}
                            value={formik.values.reservationFee}
                            onValueChange={(value) => formik.setFieldValue("reservationFee", value)}
                            isInvalid={
                                !!(formik.touched.reservationFee && formik.errors.reservationFee)
                            }
                            errorMessage={formik.errors.reservationFee}
                            onBlur={() => formik.setFieldTouched("reservationFee")}
                            isRequired
                        />
                    </div>
                </div>
            </FormSection>

            {/* SPECS */}
            <FormSection title={t("fleet.add_unit_section_specs")}>
                <div className="grid gap-4 md:grid-cols-12">
                    {/* seatingCapacity */}
                    <div className="md:col-span-4">
                        <NumberInputStyled
                            step={1}
                            min={0}
                            label={t("vehicle_model.seating_capacity")}
                            placeholder={t("vehicle_model.seating_capacity_placeholder")}
                            value={formik.values.seatingCapacity}
                            onValueChange={(value) =>
                                formik.setFieldValue("seatingCapacity", value)
                            }
                            isInvalid={
                                !!(formik.touched.seatingCapacity && formik.errors.seatingCapacity)
                            }
                            errorMessage={formik.errors.seatingCapacity}
                            onBlur={() => formik.setFieldTouched("seatingCapacity")}
                            isRequired
                        />
                    </div>

                    {/* numberOfAirbags */}
                    <div className="md:col-span-4">
                        <NumberInputStyled
                            step={1}
                            min={0}
                            label={t("vehicle_model.airbag")}
                            placeholder={t("vehicle_model.airbag_placeholder")}
                            value={formik.values.numberOfAirbags}
                            onValueChange={(value) =>
                                formik.setFieldValue("numberOfAirbags", value)
                            }
                            isInvalid={
                                !!(formik.touched.numberOfAirbags && formik.errors.numberOfAirbags)
                            }
                            errorMessage={formik.errors.numberOfAirbags}
                            onBlur={() => formik.setFieldTouched("numberOfAirbags")}
                            isRequired
                        />
                    </div>

                    {/* motorPower */}
                    <div className="md:col-span-4">
                        <NumberInputStyled
                            step={0.1}
                            min={0}
                            label={t("vehicle_model.motor_power")}
                            placeholder={t("vehicle_model.motor_power_placeholder")}
                            value={formik.values.motorPower}
                            onValueChange={(value) => {
                                formik.setFieldValue("motorPower", value)
                            }}
                            isInvalid={!!(formik.touched.motorPower && formik.errors.motorPower)}
                            errorMessage={formik.errors.motorPower}
                            onBlur={() => formik.setFieldTouched("motorPower")}
                            isRequired
                        />
                    </div>

                    {/* batteryCapacity */}
                    <div className="md:col-span-4">
                        <NumberInputStyled
                            step={0.1}
                            min={0}
                            label={t("vehicle_model.battery_capacity")}
                            placeholder={t("vehicle_model.battery_capacity_placeholder")}
                            value={formik.values.batteryCapacity}
                            onValueChange={(value) => {
                                formik.setFieldValue("batteryCapacity", value)
                            }}
                            isInvalid={
                                !!(formik.touched.batteryCapacity && formik.errors.batteryCapacity)
                            }
                            errorMessage={formik.errors.batteryCapacity}
                            onBlur={() => formik.setFieldTouched("batteryCapacity")}
                            isRequired
                        />
                    </div>

                    {/* ecoRangeKm */}
                    <div className="md:col-span-4">
                        <NumberInputStyled
                            step={0.1}
                            min={0}
                            label={t("vehicle_model.eco_range_km")}
                            placeholder={t("vehicle_model.eco_range_km_placeholder")}
                            value={formik.values.ecoRangeKm}
                            onValueChange={(value) => formik.setFieldValue("ecoRangeKm", value)}
                            isInvalid={!!(formik.touched.ecoRangeKm && formik.errors.ecoRangeKm)}
                            errorMessage={formik.errors.ecoRangeKm}
                            onBlur={() => formik.setFieldTouched("ecoRangeKm")}
                            isRequired
                        />
                    </div>

                    {/* sportRangeKm */}
                    <div className="md:col-span-4">
                        <NumberInputStyled
                            step={0.1}
                            min={0}
                            label={t("vehicle_model.sport_range_km")}
                            placeholder={t("vehicle_model.sport_range_km_placeholder")}
                            value={formik.values.sportRangeKm}
                            onValueChange={(value) => formik.setFieldValue("sportRangeKm", value)}
                            isInvalid={
                                !!(formik.touched.sportRangeKm && formik.errors.sportRangeKm)
                            }
                            errorMessage={formik.errors.sportRangeKm}
                            onBlur={() => formik.setFieldTouched("sportRangeKm")}
                            isRequired
                        />
                    </div>
                </div>
            </FormSection>

            {/* FOOTER ACTIONS */}
            <ModalFooterStyled className="justify-end gap-3">
                <ButtonStyled
                    type="button"
                    color="secondary"
                    className="bg-slate-200 text-slate-700"
                    onPress={() => {
                        onClose()
                        formik.resetForm()
                    }}
                    isDisabled={isSubmitting}
                >
                    {t("common.cancel")}
                </ButtonStyled>

                <ButtonStyled
                    type="submit"
                    color="primary"
                    className="bg-primary text-white"
                    isDisabled={isSubmitting || !formik.isValid}
                >
                    {t("common.save")}
                </ButtonStyled>
            </ModalFooterStyled>
        </form>
    )
}
