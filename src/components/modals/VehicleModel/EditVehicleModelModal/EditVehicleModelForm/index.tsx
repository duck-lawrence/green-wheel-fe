"use client"

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { UseMutationResult } from "@tanstack/react-query"

import {
    ButtonStyled,
    FilterTypeOption,
    FilterTypeStyle,
    ImageStyled,
    InputStyled,
    ModelImagesUploader,
    ModalFooterStyled,
    TextareaStyled,
    VehicleSubImagesScroll
} from "@/components"
import { FALLBACK_IMAGE_URL } from "@/constants/constants"
import { BackendError } from "@/models/common/response"
import { UpdateVehicleModelReq } from "@/models/vehicle/schema/request"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"

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

type FormValues = {
    name: string
    description: string
    brandId: string
    segmentId: string
    costPerDay: string
    depositFee: string
    seatingCapacity: string
    numberOfAirbags: string
    motorPower: string
    batteryCapacity: string
    ecoRangeKm: string
    sportRangeKm: string
}

function buildInitialValues(model: VehicleModelViewRes): FormValues {
    return {
        name: model.name ?? "",
        description: model.description ?? "",
        brandId: model.brand?.id ?? "",
        segmentId: model.segment?.id ?? "",
        costPerDay: model.costPerDay != null ? model.costPerDay.toString() : "",
        depositFee: model.depositFee != null ? model.depositFee.toString() : "",
        seatingCapacity:
            model.seatingCapacity != null ? model.seatingCapacity.toString() : "",
        numberOfAirbags:
            model.numberOfAirbags != null ? model.numberOfAirbags.toString() : "",
        motorPower: model.motorPower != null ? model.motorPower.toString() : "",
        batteryCapacity:
            model.batteryCapacity != null ? model.batteryCapacity.toString() : "",
        ecoRangeKm: model.ecoRangeKm != null ? model.ecoRangeKm.toString() : "",
        sportRangeKm: model.sportRangeKm != null ? model.sportRangeKm.toString() : ""
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
        async (values: FormValues) => {
            const payload: UpdateVehicleModelReq = {
                name: values.name.trim(),
                description: values.description.trim(),
                brandId: values.brandId,
                segmentId: values.segmentId,
                costPerDay: Number(values.costPerDay),
                depositFee: Number(values.depositFee),
                seatingCapacity: Number(values.seatingCapacity),
                numberOfAirbags: Number(values.numberOfAirbags),
                motorPower: Number(values.motorPower),
                batteryCapacity: Number(values.batteryCapacity),
                ecoRangeKm: Number(values.ecoRangeKm),
                sportRangeKm: Number(values.sportRangeKm)
            }

            await updateMutation.mutateAsync({
                id: vehicleModel.id,
                payload
            })
        },
        [updateMutation, vehicleModel.id]
    )

    const formik = useFormik<FormValues>({
        initialValues: buildInitialValues(vehicleModel),
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string()
                .trim()
                .required(t("vehicle_model.name_require")),
            description: Yup.string()
                .trim()
                .required(t("vehicle_model.description_require")),
            brandId: Yup.string()
                .trim()
                .required(t("vehicle_model.brand_id_require")),
            segmentId: Yup.string()
                .trim()
                .required(t("vehicle_model.segment_id_require")),

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

            seatingCapacity: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.seating_capacity_require"))
                .required(t("vehicle_model.seating_capacity_require"))
                .moreThan(
                    0,
                    t("vehicle_model.seating_capacity_can_not_negative")
                ),

            numberOfAirbags: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.airbag_require"))
                .required(t("vehicle_model.airbag_require"))
                .moreThan(0, t("vehicle_model.airbag_can_not_negative")),

            motorPower: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.motor_power_require"))
                .required(t("vehicle_model.motor_power_require"))
                .moreThan(
                    0,
                    t("vehicle_model.motor_power_can_not_negative")
                ),

            batteryCapacity: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.battery_capacity_require"))
                .required(t("vehicle_model.battery_capacity_require"))
                .moreThan(
                    0,
                    t("vehicle_model.battery_capacity_can_not_negative")
                ),

            ecoRangeKm: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.eco_range_km_require"))
                .required(t("vehicle_model.eco_range_km_require"))
                .moreThan(
                    0,
                    t("vehicle_model.eco_range_km_can_not_negative")
                ),

            sportRangeKm: Yup.number()
                .transform(numericTransform)
                .typeError(t("vehicle_model.sport_range_km_require"))
                .required(t("vehicle_model.sport_range_km_require"))
                .moreThan(
                    0,
                    t("vehicle_model.sport_range_km_can_not_negative")
                )
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
        const urls = [
            vehicleModel.imageUrl,
            ...(vehicleModel.imageUrls ?? [])
        ].filter((url): url is string => Boolean(url))

        return urls.length > 0 ? urls : [FALLBACK_IMAGE_URL]
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
                            onValueChange={(value) =>
                                formik.setFieldValue("name", value)
                            }
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
                                await formik.setFieldValue(
                                    "brandId",
                                    value?.toString() ?? ""
                                )
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
                                <FilterTypeOption key={option.id}>
                                    {option.label}
                                </FilterTypeOption>
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
                                await formik.setFieldValue(
                                    "segmentId",
                                    value?.toString() ?? ""
                                )
                                formik.setFieldTouched("segmentId")
                            }}
                            isInvalid={!!(
                                formik.touched.segmentId && formik.errors.segmentId
                            )}
                            errorMessage={formik.errors.segmentId}
                            disallowEmptySelection={false}
                            isClearable={false}
                            isRequired
                            isDisabled={segmentOptions.length === 0}
                        >
                            {segmentOptions.map((option) => (
                                <FilterTypeOption key={option.id}>
                                    {option.label}
                                </FilterTypeOption>
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
                            onValueChange={(value) =>
                                formik.setFieldValue("description", value)
                            }
                            isInvalid={!!(
                                formik.touched.description && formik.errors.description
                            )}
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
                        <InputStyled
                            type="number"
                            step="0.01"
                            min={0}
                            label={t("vehicle_model.cost_per_day")}
                            placeholder={t("vehicle_model.cost_per_day_placeholder")}
                            value={formik.values.costPerDay}
                            onValueChange={(value) =>
                                formik.setFieldValue("costPerDay", value)
                            }
                            isInvalid={!!(
                                formik.touched.costPerDay &&
                                formik.errors.costPerDay
                            )}
                            errorMessage={formik.errors.costPerDay}
                            onBlur={() => formik.setFieldTouched("costPerDay")}
                            isRequired
                        />
                    </div>

                    {/* depositFee */}
                    <div className="md:col-span-6">
                        <InputStyled
                            type="number"
                            step="0.01"
                            min={0}
                            label={t("vehicle_model.deposit_fee")}
                            placeholder={t("vehicle_model.deposit_fee_placeholder")}
                            value={formik.values.depositFee}
                            onValueChange={(value) =>
                                formik.setFieldValue("depositFee", value)
                            }
                            isInvalid={!!(
                                formik.touched.depositFee &&
                                formik.errors.depositFee
                            )}
                            errorMessage={formik.errors.depositFee}
                            onBlur={() => formik.setFieldTouched("depositFee")}
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
                        <InputStyled
                            type="number"
                            min={0}
                            label={t("vehicle_model.seating_capacity")}
                            placeholder={t("vehicle_model.seating_capacity_placeholder")}
                            value={formik.values.seatingCapacity}
                            onValueChange={(value) =>
                                formik.setFieldValue("seatingCapacity", value)
                            }
                            isInvalid={!!(
                                formik.touched.seatingCapacity &&
                                formik.errors.seatingCapacity
                            )}
                            errorMessage={formik.errors.seatingCapacity}
                            onBlur={() => formik.setFieldTouched("seatingCapacity")}
                            isRequired
                        />
                    </div>

                    {/* numberOfAirbags */}
                    <div className="md:col-span-4">
                        <InputStyled
                            type="number"
                            min={0}
                            label={t("vehicle_model.airbag")}
                            placeholder={t("vehicle_model.airbag_placeholder")}
                            value={formik.values.numberOfAirbags}
                            onValueChange={(value) =>
                                formik.setFieldValue("numberOfAirbags", value)
                            }
                            isInvalid={!!(
                                formik.touched.numberOfAirbags &&
                                formik.errors.numberOfAirbags
                            )}
                            errorMessage={formik.errors.numberOfAirbags}
                            onBlur={() => formik.setFieldTouched("numberOfAirbags")}
                            isRequired
                        />
                    </div>

                    {/* motorPower */}
                    <div className="md:col-span-4">
                        <InputStyled
                            type="number"
                            step="0.1"
                            min={0}
                            label={t("vehicle_model.motor_power")}
                            placeholder={t("vehicle_model.motor_power_placeholder")}
                            value={formik.values.motorPower}
                            onValueChange={(value) =>
                                formik.setFieldValue("motorPower", value)
                            }
                            isInvalid={!!(
                                formik.touched.motorPower &&
                                formik.errors.motorPower
                            )}
                            errorMessage={formik.errors.motorPower}
                            onBlur={() => formik.setFieldTouched("motorPower")}
                            isRequired
                        />
                    </div>

                    {/* batteryCapacity */}
                    <div className="md:col-span-4">
                        <InputStyled
                            type="number"
                            step="0.1"
                            min={0}
                            label={t("vehicle_model.battery_capacity")}
                            placeholder={t("vehicle_model.battery_capacity_placeholder")}
                            value={formik.values.batteryCapacity}
                            onValueChange={(value) =>
                                formik.setFieldValue("batteryCapacity", value)
                            }
                            isInvalid={!!(
                                formik.touched.batteryCapacity &&
                                formik.errors.batteryCapacity
                            )}
                            errorMessage={formik.errors.batteryCapacity}
                            onBlur={() => formik.setFieldTouched("batteryCapacity")}
                            isRequired
                        />
                    </div>

                    {/* ecoRangeKm */}
                    <div className="md:col-span-4">
                        <InputStyled
                            type="number"
                            step="0.1"
                            min={0}
                            label={t("vehicle_model.eco_range_km")}
                            placeholder={t("vehicle_model.eco_range_km_placeholder")}
                            value={formik.values.ecoRangeKm}
                            onValueChange={(value) =>
                                formik.setFieldValue("ecoRangeKm", value)
                            }
                            isInvalid={!!(
                                formik.touched.ecoRangeKm &&
                                formik.errors.ecoRangeKm
                            )}
                            errorMessage={formik.errors.ecoRangeKm}
                            onBlur={() => formik.setFieldTouched("ecoRangeKm")}
                            isRequired
                        />
                    </div>

                    {/* sportRangeKm */}
                    <div className="md:col-span-4">
                        <InputStyled
                            type="number"
                            step="0.1"
                            min={0}
                            label={t("vehicle_model.sport_range_km")}
                            placeholder={t("vehicle_model.sport_range_km_placeholder")}
                            value={formik.values.sportRangeKm}
                            onValueChange={(value) =>
                                formik.setFieldValue("sportRangeKm", value)
                            }
                            isInvalid={!!(
                                formik.touched.sportRangeKm &&
                                formik.errors.sportRangeKm
                            )}
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
                    onPress={onClose}
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

/* ---------- subcomponents ---------- */

type ImagePreviewSectionProps = {
    imageUrls: string[]
    activeImage: number
    onSelectImage: (index: number) => void
    children?: ReactNode
}

function ImagePreviewSection({
    imageUrls,
    activeImage,
    onSelectImage,
    children
}: ImagePreviewSectionProps) {
    return (
        <section className="space-y-4">
            <header className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <ImageStyled
                    src={imageUrls[activeImage]}
                    alt="vehicle-model-preview"
                    width={720}
                    height={405}
                    className="h-full w-full object-cover"
                />
            </header>

            <VehicleSubImagesScroll
                subImgUrls={imageUrls}
                active={activeImage}
                setActive={onSelectImage}
            />

            <div className="flex justify-end">{children}</div>
        </section>
    )
}

type FormSectionProps = {
    title: string
    children: ReactNode
    description?: string
}

function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <section className="space-y-4">
            <header>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {title}
                </h3>
                {description ? (
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                ) : null}
            </header>

            {children}
        </section>
    )
}
