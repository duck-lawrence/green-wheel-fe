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
    NumberInputStyled,
    ModalFooterStyled,
    TableSelectionVehicleComponent,
    TextareaStyled,
    InputStyled
} from "@/components"
import { useGetVehicleComponents } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { CreateVehicleModelReq } from "@/models/vehicle/schema/request"
import { CreateVehicleModelRes } from "@/models/vehicle/schema/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

const COMPONENT_PAGE_SIZE = 5

type SelectOption = {
    id: string
    label: string
}

export interface VehicleModelCreateFormProps {
    createMutation: UseMutationResult<CreateVehicleModelRes, BackendError, CreateVehicleModelReq>
    brandOptions: SelectOption[]
    segmentOptions: SelectOption[]
    onClose: () => void
    isOpen: boolean
}

// type FormValues = {
//     name: string
//     description: string
//     brandId: string
//     segmentId: string
//     componentIds: string[]
//     costPerDay: string
//     depositFee: string
//     seatingCapacity: string
//     numberOfAirbags: string
//     motorPower: string
//     batteryCapacity: string
//     ecoRangeKm: string
//     sportRangeKm: string
// }

export function VehicleModelCreateForm({
    createMutation,
    brandOptions,
    segmentOptions,
    onClose,
    isOpen
}: VehicleModelCreateFormProps) {
    const { t } = useTranslation()

    // helper for transforming "" -> NaN so Yup.number() can .required()
    const numericTransform = useCallback((value: unknown, originalValue: unknown) => {
        if (typeof originalValue === "string" && originalValue.trim() === "") {
            return NaN
        }
        return value
    }, [])

    const [componentPage, setComponentPage] = useState(1)

    const {
        data: componentData,
        isLoading: isComponentLoading,
        isFetching: isComponentFetching,
        error: componentError
    } = useGetVehicleComponents({
        enabled: isOpen,
        pagination: { pageNumber: componentPage, pageSize: COMPONENT_PAGE_SIZE }
    })

    const handleSubmit = useCallback(
        async (values: CreateVehicleModelReq) => {
            await createMutation.mutateAsync(values)
        },
        [createMutation]
    )

    const formik = useFormik<CreateVehicleModelReq>({
        initialValues: {
            name: "",
            description: "",
            brandId: "",
            segmentId: "",
            componentIds: [],
            costPerDay: 0,
            depositFee: 0,
            reservationFee: 0,
            seatingCapacity: 0,
            numberOfAirbags: 0,
            motorPower: 0,
            batteryCapacity: 0,
            ecoRangeKm: 0,
            sportRangeKm: 0
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required(t("vehicle_model.name_require")),
            description: Yup.string().trim().required(t("vehicle_model.description_require")),
            brandId: Yup.string().trim().required(t("vehicle_model.brand_id_require")),
            segmentId: Yup.string().trim().required(t("vehicle_model.segment_id_require")),
            componentIds: Yup.array().of(Yup.string().trim()).optional(),

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

    const componentItems = useMemo(
        () => (Array.isArray(componentData) ? componentData : componentData?.items ?? []),
        [componentData]
    )

    const componentErrorMessage = useMemo(() => {
        if (!componentError) return
        if (typeof componentError === "object" && "detail" in componentError)
            return translateWithFallback(t, (componentError as BackendError).detail)
        if (componentError instanceof Error) return componentError.message
        return t("vehicle_component.fetch_error")
    }, [componentError, t])

    const selectedComponentIds = useMemo(
        () => new Set(formik.values.componentIds),
        [formik.values.componentIds]
    )

    const isComponentLoadingInitial = isComponentLoading && !componentData
    const isComponentTableLoading = (isComponentLoading && !componentData) || isComponentFetching
    const componentCurrentPage = componentData?.pageNumber ?? componentPage
    const componentResolvedPageSize = componentData?.pageSize ?? COMPONENT_PAGE_SIZE
    const componentTotalPages = componentData?.totalPages

    // reset form when modal closes, also reset mutation state
    useEffect(() => {
        if (!isOpen) {
            formik.resetForm()
            createMutation.reset()
            setComponentPage(1)
        }
    }, [isOpen, createMutation, formik])

    const isSubmitting = formik.isSubmitting || createMutation.isPending
    const isSubmitDisabled =
        isSubmitting || !formik.isValid || isComponentLoadingInitial || !!componentErrorMessage

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
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
                            minRows={4}
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

            {/* COMPONENTS */}
            <FormSection title={t("vehicle_component.component", "Components")}>
                <div className="space-y-4">
                    <TableSelectionVehicleComponent
                        items={componentItems}
                        selectedIds={selectedComponentIds}
                        onSelectionChange={(next) =>
                            formik.setFieldValue("componentIds", Array.from(next))
                        }
                        isLoading={isComponentTableLoading}
                        error={componentErrorMessage}
                        showContainer
                        page={componentCurrentPage}
                        pageSize={componentResolvedPageSize}
                        totalPages={componentTotalPages}
                        onPageChange={setComponentPage}
                    />
                </div>
            </FormSection>

            {/* PRICING */}
            <FormSection title={t("fleet.add_unit_section_pricing")}>
                <div className="grid gap-4 md:grid-cols-12">
                    {/* costPerDay */}
                    <div className="md:col-span-6">
                        <NumberInputStyled
                            step={0.01}
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
                            max={9999.9}
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
                    onPress={onClose}
                    isDisabled={isSubmitting}
                >
                    {t("common.cancel")}
                </ButtonStyled>

                <ButtonStyled
                    type="submit"
                    color="primary"
                    className="bg-primary text-white"
                    isDisabled={isSubmitDisabled}
                >
                    {t("common.create")}
                </ButtonStyled>
            </ModalFooterStyled>
        </form>
    )
}

type FormSectionProps = {
    title: string
    description?: string
    children: ReactNode
}

function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <section className="space-y-4">
            <header>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {title}
                </h3>
                {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
            </header>

            {children}
        </section>
    )
}
