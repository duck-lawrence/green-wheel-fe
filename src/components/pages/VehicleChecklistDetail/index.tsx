"use client"
import { ButtonStyled, InputStyled, SignatureSection, SpinnerStyled } from "@/components"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import { useGetVehicleChecklistById, useName, useUpdateVehicleChecklist } from "@/hooks"
import { UpdateVehicleChecklistReq } from "@/models/checklist/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TableCheckListItems } from "./TableCheckListItems"
import { Spinner } from "@heroui/react"
import { VehicleChecklistType } from "@/constants/enum"
import Link from "next/link"

export function VehicleChecklistDetail({ id, isStaff = false }: { id: string; isStaff?: boolean }) {
    const { t } = useTranslation()
    const { toFullName } = useName()

    const { data: checklist, isLoading } = useGetVehicleChecklistById({
        id: id as string,
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

    const updateChecklist = useUpdateVehicleChecklist({})
    const handleUpdate = useCallback(
        async (value: UpdateVehicleChecklistReq) => {
            await updateChecklist.mutateAsync({
                id: checklist!.id,
                req: {
                    checklistItems: value.checklistItems,
                    isSignedByCustomer: value.isSignedByCustomer,
                    isSignedByStaff: value.isSignedByStaff
                }
            })
        },
        [checklist, updateChecklist]
    )

    const formik = useFormik({
        initialValues: {
            isSignedByStaff: checklist?.isSignedByStaff ?? false,
            isSignedByCustomer: checklist?.isSignedByCustomer ?? false,
            checklistItems: checklist?.vehicleChecklistItems || []
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            isSignedByStaff: Yup.boolean().oneOf([true], t("signature.signed_by_staff_require")),
            isSignedByCustomer:
                checklist?.type == VehicleChecklistType.OutOfContract
                    ? Yup.boolean().notRequired()
                    : Yup.boolean().oneOf([true], t("signature.signed_by_customer_require"))
        }),
        onSubmit: handleUpdate
    })

    if (isLoading) {
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
                {checklist?.contractId && (
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
                    value={checklist?.vehicle.licensePlate}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.staff_name")}
                    value={toFullName({
                        firstName: checklist?.staff.firstName,
                        lastName: checklist?.staff.lastName
                    })}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.customer_name")}
                    value={toFullName({
                        firstName: checklist?.customer?.firstName,
                        lastName: checklist?.customer?.lastName
                    })}
                    readOnly
                />

                {/* <div className="flex flex-col gap-4"></div> */}
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Table */}
            <TableCheckListItems
                isEditable={isEditable}
                // checklistId={id as string}
                vehicleCheckListItem={formik.values.checklistItems}
                setFieldValue={formik.setFieldValue}
            />

            {/* <div className="flex justify-between px-16 pt-10 gap-2 ">
                <CheckboxStyled
                    isReadOnly={!isStaff}
                    isSelected={formik.values.isSignedByStaff}
                    onValueChange={(value) => formik.setFieldValue("isSignedByStaff", value)}
                >
                    {t("signature.signed_by_staff")}
                </CheckboxStyled>
                <CheckboxStyled
                    isReadOnly={!isStaff}
                    isSelected={formik.values.isSignedByCustomer}
                    onValueChange={(value) => formik.setFieldValue("isSignedByCustomer", value)}
                >
                    {t("signature.signed_by_customer")}
                </CheckboxStyled>
            </div> */}

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
