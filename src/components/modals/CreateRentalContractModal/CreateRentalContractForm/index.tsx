"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import Link from "next/link"

import {
    useBookingFilterStore,
    useGetAllStations,
    useGetMe,
    useCreateRentalContract,
    useDay,
    useCreateContractManual,
    useName
} from "@/hooks"
import { ButtonStyled, InputStyled, ImageStyled, TextareaStyled, TempInvoice } from "@/components"
import { Spinner } from "@heroui/react"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { BackendError } from "@/models/common/response"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { CheckboxStyled } from "@/components/styled/CheckboxStyled"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"

type FormValues = {
    fullName: string
    phone: string
    email: string
    stationId: string
    note: string
    // paymentMethod: PaymentMethod
    agreeTerms: boolean
    agreeDataPolicy: boolean
}

export const CreateRentalContractForm = ({
    isCustomer = false,
    isStaff = false,
    onSuccess,
    totalDays,
    totalPrice,
    modelViewRes
}: {
    isCustomer: boolean
    isStaff: boolean
    onSuccess?: () => void
    totalDays: number
    totalPrice: number
    modelViewRes: VehicleModelViewRes
}) => {
    const { t } = useTranslation()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const { toFullName } = useName()
    const [mounted, setMounted] = useState(false)
    const createContract = useCreateRentalContract({ onSuccess })
    const createContractManual = useCreateContractManual({ onSuccess })

    const {
        data: userMe,
        isLoading: isUserLoading,
        error: userError
    } = useGetMe({ enabled: isCustomer })
    const {
        data: stations,
        isLoading: isStationsLoading,
        error: stationsError
    } = useGetAllStations()

    const stationId = useBookingFilterStore((s) => s.stationId)
    const startDate = useBookingFilterStore((s) => s.startDate)
    const endDate = useBookingFilterStore((s) => s.endDate)

    const station = useMemo(() => {
        return stations?.filter((s) => s.id === stationId)[0]
    }, [stationId, stations])

    // =========================
    // Handle create
    // =========================
    const handleCreateContract = useCallback(async () => {
        await createContract.mutateAsync({
            modelId: modelViewRes.id,
            stationId: stationId!,
            startDate: startDate!,
            endDate: endDate!
        })
    }, [createContract, endDate, modelViewRes.id, startDate, stationId])
    const handleCreateManual = useCallback(async () => {
        if (!user) return
        await createContractManual.mutateAsync({
            customerId: user.id,
            modelId: modelViewRes.id,
            stationId: stationId!,
            startDate: startDate!,
            endDate: endDate!
        })
    }, [createContractManual, endDate, modelViewRes.id, startDate, stationId, user])

    // handle moute
    useEffect(() => {
        setMounted(!isUserLoading && !isStationsLoading)
    }, [isStationsLoading, isUserLoading])

    useEffect(() => {
        if (userError || stationsError) {
            const error = (userError as BackendError) || (stationsError as BackendError)
            toast.error(translateWithFallback(t, error.detail))
            onSuccess?.()
        }
    }, [onSuccess, stationsError, t, userError])

    const initialValues: FormValues = {
        fullName: toFullName({
            firstName: user?.firstName,
            lastName: user?.lastName
        }),
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        stationId: stationId || "",
        note: "",
        agreeTerms: false,
        agreeDataPolicy: false
    }

    const formik = useFormik<FormValues>({
        enableReinitialize: true,
        validateOnMount: true,
        initialValues,
        validationSchema: Yup.object().shape({
            agreeTerms: Yup.boolean().oneOf([true], t("contral_form.agree_terms_require")),
            agreeDataPolicy: Yup.boolean().oneOf(
                [true],
                t("contral_form.agree_data_policy_require")
            )
        }),
        onSubmit: handleCreateContract
    })

    return (
        <div className="max-h-[95vh] px-4 sm:px-6 lg:px-8">
            {mounted ? (
                <div className="mx-auto max-w-5xl bg-white rounded-lg ">
                    <form onSubmit={formik.handleSubmit} className="px-6" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cột trái */}
                            <div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Họ tên */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.renter_name")}
                                            placeholder={t("car_rental.renter_name_placeholder")}
                                            value={formik.values.fullName}
                                            readOnly={true}
                                        />

                                        {/* Phone */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.phone")}
                                            placeholder={t("car_rental.phone_placeholder")}
                                            type="tel"
                                            inputMode="numeric"
                                            value={formik.values.phone}
                                            readOnly={true}
                                        />

                                        {/* Pickup location */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.pickup_location")}
                                            value={`${station?.name || ""} - ${
                                                station?.address || ""
                                            }`}
                                            readOnly={true}
                                        />

                                        {/* Email */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.email")}
                                            placeholder={t("car_rental.email_placeholder")}
                                            type="email"
                                            value={formik.values.email}
                                            readOnly={true}
                                        />
                                    </div>

                                    {/* Note */}
                                    <TextareaStyled
                                        label={t("car_rental.note")}
                                        placeholder=""
                                        value={formik.values.note}
                                        onValueChange={(v) => formik.setFieldValue("note", v)}
                                        onBlur={() => formik.setFieldTouched("note", true)}
                                        isInvalid={!!(formik.touched.note && formik.errors.note)}
                                        errorMessage={
                                            formik.touched.note ? formik.errors.note : undefined
                                        }
                                        minRows={4}
                                    />
                                </div>

                                {/* Policy */}
                                <div className="mt-6 space-y-4">
                                    <CheckboxStyled
                                        id="agreeTerms"
                                        name="agreeTerms"
                                        checked={formik.values.agreeTerms}
                                        isInvalid={
                                            !!(
                                                formik.touched.agreeTerms &&
                                                formik.errors.agreeTerms
                                            )
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="mt-1"
                                    >
                                        {t("car_rental.agree_terms")}{" "}
                                        <Link href="#" className="text-blue-600 hover:underline">
                                            {t("car_rental.payment_terms")}
                                        </Link>{" "}
                                        {t("car_rental.of_green_wheel")}
                                    </CheckboxStyled>

                                    <CheckboxStyled
                                        id="agreeDataPolicy"
                                        name="agreeDataPolicy"
                                        checked={formik.values.agreeDataPolicy}
                                        isInvalid={
                                            !!(
                                                formik.touched.agreeDataPolicy &&
                                                formik.errors.agreeDataPolicy
                                            )
                                        }
                                        // aria-errormessage={formik.errors.agreeDataPolicy}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {t("car_rental.agree_data_policy")}{" "}
                                        <Link href="#" className="text-blue-600 hover:underline">
                                            {t("car_rental.data_sharing_terms")}
                                        </Link>{" "}
                                        {t("car_rental.of_green_wheel")}
                                    </CheckboxStyled>
                                </div>
                            </div>

                            {/* Cột phải: Thông tin xe */}
                            <div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="
                                                relative overflow-hidden rounded-md
                                                w-40 h-28
                                                sm:w-48 sm:h-32
                                                md:w-56 md:h-36
                                            "
                                        >
                                            <ImageStyled
                                                src={modelViewRes.imageUrl || ""}
                                                alt={t("car_rental.vehicle")}
                                                className="absolute inset-0 w-full h-full object-contain"
                                                width={800}
                                                height={520}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium">
                                                {modelViewRes.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium">{station?.name}</h4>
                                            <div>{station?.address}</div>
                                        </div>
                                        <div className="mt-2 flex items-center">
                                            <span>
                                                {`${totalDays} ${t(
                                                    "car_rental.days"
                                                )} • ${formatDateTime({
                                                    date: startDate!
                                                })} → ${formatDateTime({ date: endDate! })}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-medium text-center">
                                            {t("invoice.temp")}
                                        </h4>
                                        <TempInvoice
                                            model={modelViewRes}
                                            totalDays={totalDays}
                                            totalPrice={totalPrice}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 text-center">
                            <ButtonStyled
                                type="submit"
                                isDisabled={!formik.isValid || formik.isSubmitting}
                                isLoading={formik.isSubmitting}
                                color={
                                    !formik.isValid || formik.isSubmitting ? "default" : "success"
                                }
                                variant={!formik.isValid || formik.isSubmitting ? "flat" : "solid"}
                                className="px-8 py-2 rounded-md"
                            >
                                {t("rental_contract.create")}
                            </ButtonStyled>
                        </div>
                    </form>
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    )
}
