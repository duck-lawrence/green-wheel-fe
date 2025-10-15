"use client"

import React, { useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"

import {
    ButtonStyled,
    DatePickerStyled,
    EnumPicker,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled
} from "@/components"
import { Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
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

    const initialValues = useMemo(
        () => ({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phone: user?.phone ?? "",
            sex: user?.sex ?? Sex.Male,
            dateOfBirth: user?.dateOfBirth ?? ""
        }),
        [user]
    )

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
            await updateUserMutation.mutateAsync({ userId: user.id, data: payload })
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
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-5 md:flex-row">
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

                        <InputStyled
                            label={t("user.phone")}
                            variant="bordered"
                            maxLength={10}
                            value={formik.values.phone ?? ""}
                            onValueChange={(value) => formik.setFieldValue("phone", value)}
                            isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                            errorMessage={formik.errors.phone}
                            onBlur={() => formik.setFieldTouched("phone")}
                        />

                        <div className="flex flex-col gap-5 md:flex-row">
                            <EnumPicker
                                label={t("user.sex")}
                                labels={SexLabels}
                                value={formik.values.sex}
                                onChange={(val) => formik.setFieldValue("sex", val)}
                            />

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
                        isDisabled={!formik.isValid}
                    >
                        {t("common.save_changes")}
                    </ButtonStyled>
                </ModalFooterStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
