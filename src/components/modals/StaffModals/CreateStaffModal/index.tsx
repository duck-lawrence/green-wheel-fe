"use client"

import {
    AutocompleteStyle,
    ButtonStyled,
    DatePickerStyled,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components/styled"
import React, { useEffect, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { AutocompleteItem } from "@heroui/react"
import { StationViewRes } from "@/models/station/schema/response"
import { NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
import { useCreateStaff, useDay } from "@/hooks"
import { Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { EnumPicker } from "@/components/modules/EnumPicker"
import { MapPinAreaIcon } from "@phosphor-icons/react"

type NewStaffFormValues = {
    firstName: string
    lastName: string
    email: string
    phone: string
    sex: Sex | null
    dateOfBirth: string
    stationId: string
}

type NewStaffModalProps = {
    isOpen: boolean
    onClose: () => void
    stations: StationViewRes[]
    onCreated?: () => void
}

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/

const INITIAL_VALUES: NewStaffFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: Sex.Male,
    dateOfBirth: "",
    stationId: ""
}

export function NewStaffModal({ isOpen, onClose, stations, onCreated }: NewStaffModalProps) {
    const { t } = useTranslation()
    const { formatDateTime, toDate } = useDay({ defaultFormat: "YYYY-MM-DD" })

    const stationOptions = useMemo(
        () =>
            stations.map((station) => ({
                id: station.id,
                label: station.name
            })),
        [stations]
    )

    const createStaffMutation = useCreateStaff({
        onSuccess: () => {
            onCreated?.()
            onClose()
        }
    })

    const formik = useFormik<NewStaffFormValues>({
        initialValues: INITIAL_VALUES,
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required(t("user.first_name_require"))
                .matches(NAME_REGEX, t("user.invalid_first_name")),
            lastName: Yup.string()
                .required(t("user.last_name_require"))
                .matches(NAME_REGEX, t("user.invalid_last_name")),
            email: Yup.string()
                .required(t("staff_management.form_email_required"))
                .matches(EMAIL_REGEX, t("staff_management.form_email_invalid")),
            phone: Yup.string()
                .required(t("staff_management.form_phone_required"))
                .matches(PHONE_REGEX, t("staff_management.form_phone_invalid")),
            sex: Yup.number()
                .nullable()
                .required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require")),
            stationId: Yup.string().required(t("staff_management.form_station_required"))
        }),
        onSubmit: async (values, { resetForm }) => {
            if (values.sex == null) return

            await createStaffMutation.mutateAsync({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                sex: values.sex,
                email: values.email.trim(),
                phone: values.phone.replace(/\s+/g, ""),
                stationId: values.stationId,
                dateOfBirth: values.dateOfBirth
            })
            resetForm()
        }
    })

    const { resetForm: resetFormikForm, submitForm } = formik

    useEffect(() => {
        if (!isOpen) {
            resetFormikForm()
        }
    }, [isOpen, resetFormikForm])

    const isActionDisabled = createStaffMutation.isPending || formik.isSubmitting

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
            className="max-w-xl"
        >
            <ModalContentStyled>
                <ModalHeaderStyled className="text-xl font-semibold text-gray-900">
                    {t("staff_management.add_staff_title")}
                </ModalHeaderStyled>
                <ModalBodyStyled className="space-y-5">
                    <form className="space-y-4" onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputStyled
                                name="firstName"
                                label={t("user.first_name")}
                                value={formik.values.firstName}
                                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                                onBlur={() => formik.setFieldTouched("firstName", true)}
                                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                errorMessage={formik.errors.firstName}
                                isDisabled={isActionDisabled}
                            />

                            <InputStyled
                                name="lastName"
                                label={t("user.last_name")}
                                value={formik.values.lastName}
                                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                                onBlur={() => formik.setFieldTouched("lastName", true)}
                                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                errorMessage={formik.errors.lastName}
                                isDisabled={isActionDisabled}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <InputStyled
                                name="email"
                                label={t("staff_management.form_email")}
                                type="email"
                                value={formik.values.email}
                                onValueChange={(value) => formik.setFieldValue("email", value)}
                                onBlur={() => formik.setFieldTouched("email", true)}
                                isInvalid={!!(formik.touched.email && formik.errors.email)}
                                errorMessage={formik.errors.email}
                                isDisabled={isActionDisabled}
                            />
                            <InputStyled
                                name="phone"
                                label={t("user.phone")}
                                value={formik.values.phone}
                                onValueChange={(value) => formik.setFieldValue("phone", value)}
                                onBlur={() => formik.setFieldTouched("phone", true)}
                                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                errorMessage={formik.errors.phone}
                                isDisabled={isActionDisabled}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                onInput={(event) => {
                                    const input = event.currentTarget
                                    input.value = input.value.replace(/[^0-9]/g, "")
                                }}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex flex-col gap-1">
                                <EnumPicker<Sex>
                                    label={t("user.sex")}
                                    labels={SexLabels}
                                    value={formik.values.sex ?? null}
                                    className="w-full"
                                    onChange={(val) => {
                                        if (val === null) {
                                            formik.setFieldValue("sex", null)
                                            formik.setFieldTouched("sex", true)
                                            return
                                        }
                                        const parsed = Number(val)
                                        if (Number.isNaN(parsed)) {
                                            formik.setFieldValue("sex", null)
                                            formik.setFieldTouched("sex", true)
                                            return
                                        }
                                        formik.setFieldValue("sex", parsed as Sex)
                                        formik.setFieldTouched("sex", true)
                                    }}
                                    isReadOnly={isActionDisabled}
                                />
                                {formik.touched.sex && formik.errors.sex ? (
                                    <span className="text-sm text-danger">{formik.errors.sex}</span>
                                ) : null}
                            </div>

                            <DatePickerStyled
                                className="w-full"
                                label={t("user.date_of_birth")}
                                value={
                                    formik.values.dateOfBirth
                                        ? toDate(formik.values.dateOfBirth)
                                        : null
                                }
                                onChange={(value) => {
                                    if (!value) {
                                        formik.setFieldValue("dateOfBirth", "")
                                        formik.setFieldTouched("dateOfBirth", true)
                                        return
                                    }
                                    const dob = formatDateTime({ date: value })
                                    formik.setFieldValue("dateOfBirth", dob)
                                    formik.setFieldTouched("dateOfBirth", true)
                                }}
                                isInvalid={
                                    !!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)
                                }
                                errorMessage={formik.errors.dateOfBirth}
                                isDisabled={isActionDisabled}
                            />
                            <AutocompleteStyle
                                className="w-full"
                                label={t("staff_management.form_station")}
                                placeholder={t("staff_management.form_station_placeholder")}
                                items={stationOptions}
                                startContent={<MapPinAreaIcon className="text-xl" />}
                                selectedKey={formik.values.stationId || undefined}
                                onSelectionChange={(key) => {
                                    const selected = key as string | undefined
                                    formik.setFieldValue("stationId", selected ?? "")
                                    formik.setFieldTouched("stationId", true)
                                }}
                                onBlur={() => formik.setFieldTouched("stationId", true)}
                                isInvalid={!!(formik.touched.stationId && formik.errors.stationId)}
                                errorMessage={formik.errors.stationId}
                                isDisabled={isActionDisabled || stationOptions.length === 0}
                            >
                                {stationOptions.map((option) => (
                                    <AutocompleteItem key={option.id} textValue={option.label}>
                                        {option.label}
                                    </AutocompleteItem>
                                ))}
                            </AutocompleteStyle>
                        </div>
                    </form>
                </ModalBodyStyled>
                <ModalFooterStyled className="gap-3">
                    <ButtonStyled
                        className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        onPress={() => {
                            resetFormikForm()
                            onClose()
                        }}
                        isDisabled={isActionDisabled}
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        className="bg-primary text-white px-6"
                        onPress={submitForm}
                        isDisabled={isActionDisabled || !formik.dirty || !formik.isValid}
                        isLoading={createStaffMutation.isPending}
                    >
                        {createStaffMutation.isPending
                            ? t("staff_management.creating")
                            : t("common.create")}
                    </ButtonStyled>
                </ModalFooterStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
