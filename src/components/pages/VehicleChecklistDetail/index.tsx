"use client"
import {
    ButtonStyled,
    DatePickerStyled,
    InputStyled,
    SignatureSection,
    SpinnerStyled
} from "@/components"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import { useDay, useGetVehicleChecklistById, useName, useUpdateVehicleChecklist } from "@/hooks"
import { UpdateVehicleChecklistReq } from "@/models/checklist/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { TableCheckListItems } from "./TableCheckListItems"
import { Spinner } from "@heroui/react"
import { DamageStatus, VehicleChecklistType } from "@/constants/enum"
import Link from "next/link"
import { fromDate } from "@internationalized/date"
import { DEFAULT_DATE_FORMAT, DEFAULT_TIMEZONE } from "@/constants/constants"

export function VehicleChecklistDetail({ id, isStaff = false }: { id: string; isStaff?: boolean }) {
    const { t } = useTranslation()
    const { toFullName } = useName()
    const { formatDateTime: formatDate, toDate } = useDay({
        defaultFormat: DEFAULT_DATE_FORMAT
    })

    const { formatDateTime, toZonedDateTime } = useDay()

    const { data: checklist, isLoading } = useGetVehicleChecklistById({
        id,
        enabled: true
    })

    const isEditable = useMemo(() => {
        return isStaff && !checklist?.isSignedByStaff && !checklist?.isSignedByCustomer
    }, [checklist?.isSignedByCustomer, checklist?.isSignedByStaff, isStaff])

    const contractUrl = useMemo(() => {
        return isStaff
            ? `/dashboard/rental-contracts/${checklist?.contractId}`
            : `/rental-contracts/${checklist?.contractId}`
    }, [checklist?.contractId, isStaff])

    const [hasItemsDamaged, setHasItemsDamaged] = useState<boolean>(
        (checklist?.type !== VehicleChecklistType.Handover &&
            checklist?.vehicleChecklistItems?.some((item) => item.status > DamageStatus.Good)) ??
            false
    )

    const updateChecklist = useUpdateVehicleChecklist({ id })
    const handleUpdate = useCallback(
        async (value: UpdateVehicleChecklistReq) => {
            const maintainDateTimeZoned = toZonedDateTime(value.maintainedUntil)
            const formatMaintainDate =
                maintainDateTimeZoned && hasItemsDamaged
                    ? formatDateTime({
                          date: maintainDateTimeZoned.set({ hour: 23, minute: 59, second: 59 })
                      })
                    : undefined

            await updateChecklist.mutateAsync({
                checklistItems: value.checklistItems,
                isSignedByCustomer: value.isSignedByCustomer,
                isSignedByStaff: value.isSignedByStaff,
                maintainedUntil: formatMaintainDate
            })
        },
        [formatDate, hasItemsDamaged, toZonedDateTime, updateChecklist]
    )

    const formik = useFormik({
        initialValues: {
            isSignedByStaff: checklist?.isSignedByStaff ?? false,
            isSignedByCustomer: checklist?.isSignedByCustomer ?? false,
            checklistItems: checklist?.vehicleChecklistItems || [],
            maintainedUntil: checklist?.maintainedUntil || undefined
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            isSignedByStaff: Yup.boolean().oneOf([true], t("signature.signed_by_staff_require")),
            isSignedByCustomer:
                checklist?.type == VehicleChecklistType.OutOfContract
                    ? Yup.boolean().notRequired()
                    : Yup.boolean().oneOf([true], t("signature.signed_by_customer_require")),
            maintainedUntil: hasItemsDamaged
                ? Yup.string()
                      .required(t("vehicle_checklist.maintain_until_require"))
                      .test(
                          "is-valid-maintain-date",
                          t("vehicle_checklist.invalid_maintain_until"),
                          (value) => {
                              const valueDatetime = toDate(value)
                              return (
                                  !!valueDatetime &&
                                  valueDatetime.compare(
                                      fromDate(new Date(), DEFAULT_TIMEZONE).add({ minutes: 30 })
                                  ) >= 0
                              )
                          }
                      )
                : Yup.string().notRequired()
        }),
        onSubmit: handleUpdate
    })

    if (isLoading || !checklist) {
        return <SpinnerStyled />
    }

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="rounded-2xl bg-white shadow-md px-8 py-10 border border-gray-100 max-w-6xl mx-auto"
        >
            {/* Header */}
            {/* <div className="flex flex-col md:flex-row items-center justify-between mb-8"> */}
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {t("vehicle_checklist.checklist")} –{" "}
                    <span className="text-primary">
                        {VehicleChecklistTypeLabels[checklist!.type]}
                    </span>
                </h2>
                {checklist.contractId && (
                    <Link href={contractUrl}>
                        {`${t("rental_contract.id")}: ${checklist.contractId}`}
                    </Link>
                )}
            </div>

            {/* Information */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-10"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
                {/* <div className="flex flex-col gap-4"></div> */}
                <InputStyled
                    label={t("vehicle_checklist.checklist_type")}
                    value={VehicleChecklistTypeLabels[checklist!.type]}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.vehicle_license_plate")}
                    value={checklist.vehicle.licensePlate}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.staff_name")}
                    value={toFullName({
                        firstName: checklist.staff.firstName,
                        lastName: checklist.staff.lastName
                    })}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.customer_name")}
                    value={toFullName({
                        firstName: checklist.customer?.firstName,
                        lastName: checklist.customer?.lastName
                    })}
                    readOnly
                />

                {/* <div className="flex flex-col gap-4"></div> */}
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Table */}
            <TableCheckListItems
                isEditable={isEditable}
                checklistType={checklist.type}
                vehicleCheckListItem={formik.values.checklistItems}
                setFieldValue={formik.setFieldValue}
                setHasItemsDamaged={setHasItemsDamaged}
            />

            <DatePickerStyled
                label={t("vehicle_checklist.maintain_until")}
                value={toDate(formik.values.maintainedUntil)}
                onChange={(value) => {
                    if (!value) {
                        formik.setFieldValue("maintainedUntil", null)
                        return
                    }

                    const date = formatDate({ date: value })
                    formik.setFieldValue("maintainedUntil", date)
                }}
                className="mt-3"
                isInvalid={hasItemsDamaged && !!formik.errors.maintainedUntil}
                isReadOnly={!hasItemsDamaged}
                isRequired={hasItemsDamaged}
                errorMessage={hasItemsDamaged ? formik.errors.maintainedUntil : undefined}
                onBlur={() => {
                    formik.setFieldTouched("maintainedUntil")
                }}
            />

            {/* Signature */}
            <SignatureSection
                // className="pt-10"
                sectionClassName="mt-8"
                isReadOnly={!isEditable}
                staffSign={{
                    id: "isSignedByStaff",
                    name: "isSignedByStaff",
                    checked: formik.values.isSignedByStaff,
                    isInvalid: !!(formik.touched.isSignedByStaff && formik.errors.isSignedByStaff),
                    isSelected: formik.values.isSignedByStaff,
                    // onValueChange: (value) => formik.setFieldValue("isSignedByStaff", value)
                    onChange: formik.handleChange,
                    onBlur: formik.handleBlur
                }}
                customerSign={{
                    id: "isSignedByCustomer",
                    name: "isSignedByCustomer",
                    checked: formik.values.isSignedByCustomer,
                    isInvalid: !!(
                        formik.touched.isSignedByCustomer && formik.errors.isSignedByCustomer
                    ),
                    isSelected: formik.values.isSignedByCustomer,
                    // onValueChange: (value) => formik.setFieldValue("isSignedByCustomer", value)
                    onChange: formik.handleChange,
                    onBlur: formik.handleBlur
                }}
            />

            {isEditable && (
                <div className="flex justify-center">
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        className="mt-10 p-6"
                        isDisabled={formik.isSubmitting || !formik.isValid}
                        onPress={() => formik.handleSubmit()}
                    >
                        {formik.isSubmitting ? <Spinner color="secondary" /> : t("common.update")}
                    </ButtonStyled>
                </div>
            )}
        </form>
    )
}
