"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"

import {
    ButtonStyled,
    ButtonToggleVisibility,
    DatePickerStyled,
    FilterTypeOption,
    FilterTypeStyle,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from "@/constants/regex"
import { useDay, useUpdateUser } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { UserUpdateReq } from "@/models/user/schema/request"

type EditUserModalProps = {
    user: UserProfileViewRes | null
    isOpen: boolean
    onClose: () => void
}

export function EditUserModal({ user, isOpen, onClose }: EditUserModalProps) {
    const { t } = useTranslation()
    const { formatDateTime, toDate } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const updateUserMutation = useUpdateUser({
        onSuccess: onClose
    })
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setIsPasswordVisible(false)
            setIsConfirmVisible(false)
        }
    }, [isOpen])

    const initialValues = useMemo(
        () => ({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phone: user?.phone ?? "",
            sex: user?.sex ?? Sex.Male,
            dateOfBirth: user?.dateOfBirth ?? "",
            password: "",
            confirmPassword: ""
        }),
        [user]
    )

    type UpdateUserPayload = UserUpdateReq & { password?: string }

    const formik = useFormik({
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
            password: Yup.string()
                .notRequired()
                .test("password-length", t("user.password_too_short"), (value) => {
                    if (!value) return true
                    return value.length >= 8
                })
                .test("password-strength", t("user.password_strength"), (value) => {
                    if (!value) return true
                    return PASSWORD_REGEX.test(value)
                }),
            confirmPassword: Yup.string()
                .notRequired()
                .when("password", {
                    is: (password: string | undefined) => Boolean(password && password.length),
                    then: (schema) =>
                        schema
                            .required(t("user.password_can_not_empty"))
                            .oneOf([Yup.ref("password")], t("user.confirm_password_is_incorrect")),
                    otherwise: (schema) =>
                        schema.oneOf(
                            [Yup.ref("password")],
                            t("user.confirm_password_is_incorrect")
                        )
                }),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require"))
        }),
        onSubmit: async (values) => {
            if (!user?.id) return
            const payload: UserUpdateReq = {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                sex: values.sex,
                dateOfBirth: values.dateOfBirth
            }

            const requestData: UpdateUserPayload = values.password
                ? { ...payload, password: values.password }
                : payload

            await updateUserMutation.mutateAsync({ userId: user.id, data: requestData })
        }
    })

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
            className="max-w-140"
        >
            <ModalContentStyled>
                <ModalHeaderStyled>{t("common.edit_user")}</ModalHeaderStyled>
                <ModalBodyStyled>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputStyled
                                label={t("user.last_name")}
                                variant="bordered"
                                value={formik.values.lastName}
                                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                errorMessage={formik.errors.lastName}
                                onBlur={() => formik.setFieldTouched("lastName")}
                            />

                            <InputStyled
                                label={t("user.first_name")}
                                variant="bordered"
                                value={formik.values.firstName}
                                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                errorMessage={formik.errors.firstName}
                                onBlur={() => formik.setFieldTouched("firstName")}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <InputStyled
                                label={t("auth.password")}
                                variant="bordered"
                                type={isPasswordVisible ? "text" : "password"}
                                value={formik.values.password}
                                onValueChange={(value) => formik.setFieldValue("password", value)}
                                isInvalid={!!(formik.touched.password && formik.errors.password)}
                                errorMessage={formik.errors.password}
                                onBlur={() => formik.setFieldTouched("password")}
                                endContent={
                                    <ButtonToggleVisibility
                                        isVisible={isPasswordVisible}
                                        toggleVisibility={() =>
                                            setIsPasswordVisible((prev) => !prev)
                                        }
                                    />
                                }
                            />

                            <InputStyled
                                label={t("auth.confirm_password")}
                                variant="bordered"
                                type={isConfirmVisible ? "text" : "password"}
                                value={formik.values.confirmPassword}
                                onValueChange={(value) =>
                                    formik.setFieldValue("confirmPassword", value)
                                }
                                isInvalid={
                                    !!(formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword)
                                }
                                errorMessage={formik.errors.confirmPassword}
                                onBlur={() => formik.setFieldTouched("confirmPassword")}
                                endContent={
                                    <ButtonToggleVisibility
                                        isVisible={isConfirmVisible}
                                        toggleVisibility={() =>
                                            setIsConfirmVisible((prev) => !prev)
                                        }
                                    />
                                }
                            />

                            <InputStyled
                                label={t("user.phone")}
                                variant="bordered"
                                maxLength={10}
                                value={formik.values.phone ?? ""}
                                onValueChange={(value) => formik.setFieldValue("phone", value)}
                                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                errorMessage={formik.errors.phone}
                                onBlur={() => formik.setFieldTouched("phone")}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                onInput={(event) => {
                                    event.currentTarget.value = event.currentTarget.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    )
                                }}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FilterTypeStyle
                                label={t("user.sex")}
                                selectedKeys={
                                    formik.values.sex === undefined || formik.values.sex === null
                                        ? new Set([])
                                        : new Set([String(formik.values.sex)])
                                }
                                onSelectionChange={(keys) => {
                                    if (keys === "all") return
                                    const [selected] = Array.from(keys)
                                    if (selected === undefined || selected === null) return
                                    const nextValue =
                                        typeof selected === "string"
                                            ? Number(selected)
                                            : Number(selected.toString())
                                    if (!Number.isNaN(nextValue)) {
                                        formik.setFieldValue("sex", nextValue)
                                        formik.setFieldTouched("sex", true)
                                    }
                                }}
                                isInvalid={!!(formik.touched.sex && formik.errors.sex)}
                                errorMessage={formik.errors.sex}
                                disallowEmptySelection
                            >
                                {Object.entries(SexLabels).map(([key, label]) => (
                                    <FilterTypeOption key={key}>{label}</FilterTypeOption>
                                ))}
                            </FilterTypeStyle>

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
                            />
                        </div>
                    </form>
                </ModalBodyStyled>
                <ModalFooterStyled>
                    <ButtonStyled
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onPress={onClose}
                        isDisabled={updateUserMutation.isPending}
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        className="bg-emerald-500 text-white px-6"
                        onPress={formik.submitForm}
                        isLoading={updateUserMutation.isPending}
                        isDisabled={updateUserMutation.isPending || !formik.isValid}
                    >
                        {t("common.save_changes")}
                    </ButtonStyled>
                </ModalFooterStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
