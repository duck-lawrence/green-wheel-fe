import React from "react"
import { useGetMe, useSetPassword } from "@/hooks"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import {
    ButtonStyled,
    ButtonToggleVisibility,
    DatePickerStyled,
    InputStyled
} from "@/components/styled"
import dayjs from "dayjs"
import { UserSetPasswordReq } from "@/models/auth/schema/request"
import { NAME_REGEX, PASSWORD_REGEX } from "@/constants/regex"
import { DEFAULT_TIMEZONE } from "@/constants/constants"

export function SetPasswordForm({ onSuccess }: { onSuccess?: () => void }) {
    const { t } = useTranslation()
    const setPasswordMutation = useSetPassword({ onSuccess })
    const { data: user } = useGetMe()

    const [isVisible, setIsVisible] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const toggleConFirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)

    const handleSetPassword = useCallback(
        async (values: UserSetPasswordReq) => {
            await setPasswordMutation.mutateAsync(values)
        },
        [setPasswordMutation]
    )

    const formik = useFormik({
        initialValues: {
            lastName: user?.lastName || "",
            firstName: user?.firstName || "",
            password: "",
            confirmPassword: "",
            dateOfBirth: ""
        },
        validationSchema: Yup.object({
            lastName: Yup.string()
                .required(t("user.last_name_require"))
                .matches(NAME_REGEX, t("user.invalid_last_name")),
            firstName: Yup.string()
                .required(t("user.first_name_require"))
                .matches(NAME_REGEX, t("user.invalid_first_name")),
            password: Yup.string()
                .required(t("user.password_can_not_empty"))
                .min(8, t("user.password_too_short"))
                .matches(PASSWORD_REGEX, t("user.password_strength")),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], t("user.confirm_password_equal"))
                .required(t("user.password_can_not_empty")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require"))
        }),
        onSubmit: handleSetPassword
    })

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
            {/* Title */}
            <div className="mx-auto mt-2 mb-2">
                <div className="text-center">{t("auth.complete_register")}</div>
            </div>

            {/* Input InFo */}
            <div className="flex mx-auto w-110 gap-5">
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
                />

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
                />
            </div>

            <div className="w-110 mx-auto">
                <InputStyled
                    className="my-3"
                    variant="bordered"
                    label={t("auth.password")}
                    type={isVisible ? "text" : "password"}
                    value={formik.values.password}
                    onValueChange={(value) => formik.setFieldValue("password", value)}
                    isInvalid={!!(formik.touched.password && formik.errors.password)}
                    errorMessage={formik.errors.password}
                    onBlur={() => {
                        formik.setFieldTouched("password")
                    }}
                    endContent={
                        <ButtonToggleVisibility
                            isVisible={isVisible}
                            toggleVisibility={toggleVisibility}
                        />
                    }
                />

                <InputStyled
                    className="my-3"
                    variant="bordered"
                    label={t("auth.confirm_password")}
                    type={isConfirmVisible ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onValueChange={(value) => formik.setFieldValue("confirmPassword", value)}
                    errorMessage={formik.errors.confirmPassword}
                    onBlur={() => {
                        formik.setFieldTouched("confirmPassword")
                    }}
                    isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    endContent={
                        <ButtonToggleVisibility
                            isVisible={isConfirmVisible}
                            toggleVisibility={toggleConFirmVisibility}
                        />
                    }
                />
            </div>

            <div className="mx-autow-110">
                <DatePickerStyled
                    label={t("user.date_of_birth")}
                    onChange={(val) => {
                        if (!val) {
                            formik.setFieldValue("dateOfBirth", null)
                            return
                        }

                        const dob = val
                            ? dayjs(val.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                            : ""

                        formik.setFieldValue("dateOfBirth", dob)
                    }}
                />
            </div>
            <div className="mx-auto">
                {/* <ButtonStyled onPress={onBack} className="w-5 h-10 mx-auto mt-0">
                    <ArrowLeftIcon />
                </ButtonStyled> */}

                <ButtonStyled
                    type="submit"
                    className="w-110 h-10 mx-auto mt-4"
                    isLoading={formik.isSubmitting}
                    color="primary"
                    isDisabled={!formik.isValid}
                >
                    {t("login.register")}
                </ButtonStyled>
            </div>
        </form>
    )
}
