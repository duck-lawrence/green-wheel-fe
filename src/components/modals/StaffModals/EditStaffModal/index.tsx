"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import {
    ButtonStyled,
    CitizenIdentityUploader,
    DatePickerStyled,
    DriverLicenseUploader,
    EnumPicker,
    ImageStyled,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { Select, SelectItem ,Selection} from "@heroui/react"
import { Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
import { useDay, useDeleteUser, useUpdateUser } from "@/hooks"
import { StationViewRes } from "@/models/station/schema/response"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { QUERY_KEYS } from "@/constants/queryKey"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
// import type { Selection } from "@/components/styled/FilterTypeStyle"

type EditStaffFormValues = {
    firstName: string
    lastName: string
    phone: string
    sex: Sex | null
    dateOfBirth: string
    stationId: string
}

type EditStaffModalProps = {
    staff: UserProfileViewRes | null
    isOpen: boolean
    onClose: () => void
    stations: StationViewRes[]
    onAfterDelete?: () => void
}

export function EditStaffModal({
    staff,
    isOpen,
    onClose,
    stations,
    onAfterDelete
}: EditStaffModalProps) {
    const { t } = useTranslation()
    const { formatDateTime, toDate } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const queryClient = useQueryClient()

    const updateUserMutation = useUpdateUser({
        onSuccess: onClose
    })
    const deleteUserMutation = useDeleteUser({
        onSuccess: () => {
            onAfterDelete?.()
            onClose()
        }
    })

    const stationOptions = useMemo(
        () =>
            stations.map((station) => ({
                id: station.id,
                label: station.name
            })),
        [stations]
    )

    const initialValues = useMemo<EditStaffFormValues>(
        () => ({
            firstName: staff?.firstName ?? "",
            lastName: staff?.lastName ?? "",
            phone: staff?.phone ?? "",
            sex: (staff?.sex as Sex | null) ?? Sex.Male,
            dateOfBirth: staff?.dateOfBirth ?? "",
            stationId: staff?.station?.id ?? staff?.stationId ?? ""
        }),
        [staff]
    )

    const [citizenUrl, setCitizenUrl] = useState<string | null>(staff?.citizenUrl ?? null)
    const [licenseUrl, setLicenseUrl] = useState<string | null>(staff?.licenseUrl ?? null)

    useEffect(() => {
        setCitizenUrl(staff?.citizenUrl ?? null)
        setLicenseUrl(staff?.licenseUrl ?? null)
    }, [staff])

    const formik = useFormik<EditStaffFormValues>({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required(t("user.first_name_require"))
                .matches(NAME_REGEX, t("user.invalid_first_name")),
            lastName: Yup.string()
                .required(t("user.last_name_require"))
                .matches(NAME_REGEX, t("user.invalid_last_name")),
            phone: Yup.string()
                .required(t("user.phone_require"))
                .matches(PHONE_REGEX, t("user.invalid_phone")),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require")),
            stationId: Yup.string().required(t("staff_management.form_station_required"))
        }),
        onSubmit: async (values) => {
            if (!staff?.id || values.sex == null) return
            await updateUserMutation.mutateAsync({
                userId: staff.id,
                data: {
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    phone: values.phone.replace(/\s+/g, ""),
                    sex: values.sex,
                    dateOfBirth: values.dateOfBirth,
                    stationId: values.stationId
                }
            })
        }
    })

    const handleCitizenUploadSuccess = useCallback(
        (data: CitizenIdentityViewRes) => {
            setCitizenUrl(data.imageUrl ?? null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
        },
        [queryClient]
    )

    const handleDriverUploadSuccess = useCallback(
        (data: DriverLicenseViewRes) => {
            setLicenseUrl(data.imageUrl ?? null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
        },
        [queryClient]
    )

    const handleDelete = async () => {
        if (!staff?.id) return
        const confirmed = window.confirm(t("staff_management.delete_confirm"))
        if (!confirmed) return
        await deleteUserMutation.mutateAsync(staff.id)
    }

    const isMutating = updateUserMutation.isPending || deleteUserMutation.isPending
    const stationError = formik.touched.stationId && formik.errors.stationId

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
            className="max-w-160"
        >
            <ModalContentStyled>
                <ModalHeaderStyled>{t("staff_management.edit_staff_title")}</ModalHeaderStyled>
                <ModalBodyStyled className="max-h-[70vh] overflow-y-auto pr-1">
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputStyled
                                label={t("user.last_name")}
                                placeholder={t("user.last_name")}
                                variant="bordered"
                                value={formik.values.lastName}
                                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                errorMessage={formik.errors.lastName}
                                onBlur={() => formik.setFieldTouched("lastName")}
                                isDisabled={isMutating}
                            />
                            <InputStyled
                                label={t("user.first_name")}
                                placeholder={t("user.first_name")}
                                variant="bordered"
                                value={formik.values.firstName}
                                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                errorMessage={formik.errors.firstName}
                                onBlur={() => formik.setFieldTouched("firstName")}
                                isDisabled={isMutating}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <InputStyled
                                label={t("staff_management.form_phone")}
                                placeholder={t("staff_management.form_phone")}
                                variant="bordered"
                                maxLength={10}
                                value={formik.values.phone}
                                onValueChange={(value) => formik.setFieldValue("phone", value)}
                                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                errorMessage={formik.errors.phone}
                                onBlur={() => formik.setFieldTouched("phone")}
                                inputMode="numeric"
                                onInput={(event) => {
                                    event.currentTarget.value = event.currentTarget.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    )
                                }}
                                isDisabled={isMutating}
                            />
                            <div className="flex flex-col gap-1">
                                <Select
                                    label={t("staff_management.form_station")}
                                    placeholder={t("staff_management.form_station_placeholder")}
                                    variant="bordered"
                                    selectedKeys={
                                        formik.values.stationId
                                            ? (new Set([formik.values.stationId]) as Selection)
                                            : (new Set() as Selection)
                                    }
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys)[0]
                                        formik.setFieldValue("stationId", key?.toString() ?? "")
                                        formik.setFieldTouched("stationId", true, true)
                                    }}
                                    onBlur={() => formik.setFieldTouched("stationId")}
                                    isInvalid={!!stationError}
                                    errorMessage={stationError ? formik.errors.stationId : undefined}
                                    isDisabled={isMutating || stationOptions.length === 0}
                                >
                                    {stationOptions.map((option) => (
                                        <SelectItem key={option.id} value={option.id}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <EnumPicker
                                    label={t("user.sex")}
                                    labels={SexLabels}
                                    value={formik.values.sex ?? undefined}
                                    className="w-full"
                                    onChange={(val) => {
                                        if (val === null) {
                                            formik.setFieldValue("sex", null)
                                            formik.setFieldTouched("sex", true)
                                            return
                                        }
                                        const nextValue = Number(val)
                                        if (Number.isNaN(nextValue)) {
                                            formik.setFieldValue("sex", null)
                                            formik.setFieldTouched("sex", true)
                                            return
                                        }
                                        formik.setFieldValue("sex", nextValue)
                                        formik.setFieldTouched("sex", true)
                                    }}
                                    isDisabled={isMutating}
                                />
                                {formik.touched.sex && formik.errors.sex ? (
                                    <span className="text-sm text-danger">{formik.errors.sex}</span>
                                ) : null}
                            </div>

                            <DatePickerStyled
                                label={t("user.date_of_birth")}
                                value={
                                    formik.values.dateOfBirth
                                        ? toDate(formik.values.dateOfBirth)
                                        : null
                                }
                                onChange={(value) => {
                                    if (!value) {
                                        formik.setFieldValue("dateOfBirth", "")
                                        return
                                    }
                                    const dob = formatDateTime({ date: value })
                                    formik.setFieldValue("dateOfBirth", dob)
                                }}
                                isInvalid={
                                    !!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)
                                }
                                errorMessage={formik.errors.dateOfBirth}
                                isDisabled={isMutating}
                            />
                        </div>
                    </form>

                    {staff?.id ? (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {t("user.citizen_identity")}
                                            </p>
                                            {!citizenUrl ? (
                                                <p className="text-sm italic text-gray-500">
                                                    {t("user.please_upload_citizen_identity")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <CitizenIdentityUploader
                                            customerId={staff.id}
                                            btnClassName="text-primary font-semibold hover:text-primary/80"
                                            onSuccess={handleCitizenUploadSuccess}
                                        />
                                    </div>
                                    {citizenUrl ? (
                                        <ImageStyled
                                            src={citizenUrl}
                                            alt={t("user.citizen_identity")}
                                            width={360}
                                            height={220}
                                            className="max-h-60 w-full rounded-lg border border-dashed border-gray-200 object-cover"
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {t("user.driver_license")}
                                            </p>
                                            {!licenseUrl ? (
                                                <p className="text-sm italic text-gray-500">
                                                    {t("user.please_upload_driver_license")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <DriverLicenseUploader
                                            customerId={staff.id}
                                            btnClassName="text-primary font-semibold hover:text-primary/80"
                                            onSuccess={handleDriverUploadSuccess}
                                        />
                                    </div>
                                    {licenseUrl ? (
                                        <ImageStyled
                                            src={licenseUrl}
                                            alt={t("user.driver_license")}
                                            width={360}
                                            height={220}
                                            className="max-h-60 w-full rounded-lg border border-dashed border-gray-200 object-cover"
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </ModalBodyStyled>
                <ModalFooterStyled className="gap-3">
                   
                    <ButtonStyled
                        type="button"
                        className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        onPress={handleDelete}
                        isDisabled={isMutating || !staff?.id}
                    >
                        {t("common.delete")}
                    </ButtonStyled>
                     <ButtonStyled
                        type="button"
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onPress={onClose}
                        isDisabled={isMutating}
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        className="bg-emerald-500 text-white px-6"
                        onPress={formik.submitForm}
                        isLoading={updateUserMutation.isPending}
                        isDisabled={isMutating || !formik.isValid || !formik.dirty}
                    >
                        {updateUserMutation.isPending
                            ? t("staff_management.saving")
                            : t("common.save_changes")}
                    </ButtonStyled>
                </ModalFooterStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
