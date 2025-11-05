"use client"

import { RoleName, Sex } from "@/constants/enum"
import { useCreateNewUser, useDay, useGetAllStations, useGetMe } from "@/hooks"
import { useFormik } from "formik"
import * as Yup from "yup"
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
import React, { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { CreateUserReq } from "@/models/user/schema/request"
import {
    AutocompleteStyled,
    ButtonStyled,
    DatePickerStyled,
    InputStyled
} from "@/components/styled"
import { EnumPicker } from "@/components/modules"
import { SexLabels } from "@/constants/labels"
import { AutocompleteItem, Spinner } from "@heroui/react"
import { BackendError } from "@/models/common/response"
import { addToast } from "@heroui/toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { MapPinAreaIcon } from "@phosphor-icons/react"

export interface CreateUserFormProps {
    isCreateCustomer?: boolean
    createRoleName?: RoleName
    createMutation: ReturnType<typeof useCreateNewUser>
}

export function CreateUserForm({
    isCreateCustomer = true,
    createRoleName,
    createMutation
}: CreateUserFormProps) {
    const { t } = useTranslation()
    const { formatDateTime } = useDay({})
    const { data: me, isLoading: isMeLoading } = useGetMe()

    const {
        data: stations,
        isLoading: isStationsLoading,
        error: stationsError
    } = useGetAllStations()

    const handleSubmit = useCallback(
        async (value: CreateUserReq) => {
            await createMutation.mutateAsync(value)
        },
        [createMutation]
    )

    const formik = useFormik<CreateUserReq>({
        initialValues: {
            email: undefined,
            phone: "",
            firstName: "",
            lastName: "",
            sex: Sex.Male,
            dateOfBirth: "",
            stationId: me?.station?.id || stations?.[0].id,
            roleName: createRoleName
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            phone: Yup.string()
                .required(t("user.phone_require"))
                .matches(PHONE_REGEX, t("user.invalid_phone")),
            firstName: Yup.string()
                .required(t("user.first_name_require"))
                .matches(NAME_REGEX, t("user.invalid_first_name")),
            lastName: Yup.string()
                .required(t("user.last_name_require"))
                .matches(NAME_REGEX, t("user.invalid_last_name")),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require")),

            email: isCreateCustomer
                ? Yup.string().notRequired()
                : Yup.string()
                      .required(t("user.email_require"))
                      .matches(EMAIL_REGEX, t("user.invalid_email")),
            stationId: isCreateCustomer
                ? Yup.string().notRequired()
                : Yup.string().required(t("user.station_require"))
        }),
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (stationsError) {
            const error = stationsError as BackendError
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    }, [stationsError, t])

    if (isMeLoading || isStationsLoading) return <Spinner />

    return (
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Input InFo */}
            <InputStyled
                label={t("user.first_name")}
                variant="bordered"
                value={formik.values.firstName}
                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                errorMessage={formik.errors.firstName}
                onBlur={() => {
                    formik.setFieldTouched("firstName")
                }}
                isRequired
            />

            <InputStyled
                label={t("user.last_name")}
                variant="bordered"
                value={formik.values.lastName}
                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                errorMessage={formik.errors.lastName}
                onBlur={() => {
                    formik.setFieldTouched("lastName")
                }}
                isRequired
            />

            {!isCreateCustomer && (
                <InputStyled
                    label={t("auth.email")}
                    variant="bordered"
                    value={formik.values.email}
                    onValueChange={(value) => formik.setFieldValue("email", value)}
                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                    errorMessage={formik.errors.email}
                    onBlur={() => {
                        formik.setFieldTouched("email")
                    }}
                    readOnly={isCreateCustomer}
                    isRequired={!isCreateCustomer}
                />
            )}

            <InputStyled
                label={t("user.phone")}
                variant="bordered"
                maxLength={10}
                pattern="[0-9]*"
                onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "")
                }}
                value={formik.values.phone}
                onValueChange={(value) => formik.setFieldValue("phone", value)}
                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                errorMessage={formik.errors.phone}
                onBlur={() => {
                    formik.setFieldTouched("phone")
                }}
                isRequired
            />

            <EnumPicker
                label={t("user.sex")}
                labels={SexLabels}
                value={formik.values.sex}
                onChange={(val) => formik.setFieldValue("sex", val)}
                isClearable={false}
                isRequired
            />

            <DatePickerStyled
                label={t("user.date_of_birth")}
                isInvalid={!!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                isRequired
                errorMessage={formik.errors.dateOfBirth}
                onChange={(value) => {
                    if (!value) {
                        formik.setFieldValue("dateOfBirth", null)
                        return
                    }

                    const dob = formatDateTime({ date: value })

                    formik.setFieldValue("dateOfBirth", dob)
                }}
            />

            {!isCreateCustomer && (
                <AutocompleteStyled
                    className="col-span-2"
                    label={t("station.station")}
                    items={stations}
                    startContent={<MapPinAreaIcon className="text-xl" />}
                    selectedKey={formik.values.stationId}
                    onSelectionChange={async (id) => {
                        await formik.setFieldValue("stationId", id)
                    }}
                    isClearable={false}
                    isReadOnly={createRoleName !== RoleName.Admin}
                    isRequired={!isCreateCustomer}
                    isInvalid={!!(formik.touched.stationId && formik.errors.stationId)}
                    errorMessage={formik.errors.stationId}
                    onBlur={() => {
                        formik.setFieldTouched("stationId")
                    }}
                >
                    {(stations ?? []).map((item) => (
                        <AutocompleteItem
                            key={item.id}
                        >{`${item.name} - ${item.address}`}</AutocompleteItem>
                    ))}
                </AutocompleteStyled>
                // <InputStyled
                //     label={t("station.station")}
                //     value={`${me.station.name} - ${me.station.address}`}
                //     className="col-span-2"
                //     isRequired
                // />
            )}

            <div className="text-center col-span-2">
                <ButtonStyled
                    type="submit"
                    isLoading={formik.isSubmitting}
                    color="primary"
                    isDisabled={!formik.isValid}
                >
                    {formik.isSubmitting ? <Spinner color="secondary" /> : t("common.create")}
                </ButtonStyled>
            </div>
        </form>
    )
}
