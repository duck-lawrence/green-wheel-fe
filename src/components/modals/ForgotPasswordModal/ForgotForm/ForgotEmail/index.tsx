"use client"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback } from "react"
import { ButtonStyled, InputStyled } from "@/components/styled"
import { useTranslation } from "react-i18next"
import {
    useForgotPassword,
    useForgotPasswordDiscloresureSingleton,
    useLoginDiscloresureSingleton
} from "@/hooks"
import { Link } from "@heroui/react"

interface FortgotEmailProps {
    email: string
    setEmail: (email: string) => void
    onSuccess?: () => void
}

export function FortgotEmail({ email, setEmail, onSuccess }: FortgotEmailProps) {
    const { t } = useTranslation()
    const forgotMutation = useForgotPassword({ onSuccess })
    const { onClose: onCloseForgot } = useForgotPasswordDiscloresureSingleton()
    const { onOpen: onOpenLogin } = useLoginDiscloresureSingleton()

    const handleForgot = useCallback(
        async (values: { email: string }) => {
            await forgotMutation.mutateAsync({ ...values })
            setEmail(values.email)
        },
        [forgotMutation, setEmail]
    )

    const handleOpenLogin = useCallback(() => {
        onCloseForgot()
        onOpenLogin()
    }, [onCloseForgot, onOpenLogin])

    const formik = useFormik({
        initialValues: {
            email: email
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(t("user.email_require"))
                .matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, t("user.invalid_email"))
        }),
        onSubmit: handleForgot
    })

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            {/* <div className="mx-8 mt-2 mb-0">
                <h1 className="font-bold text-xl">{t("auth.forgot_step1")}</h1>
            </div> */}

            {/* Input email */}
            <div className="w-110 mx-auto">
                <InputStyled
                    // className="my-3"
                    variant="bordered"
                    label={t("auth.email")}
                    value={formik.values.email}
                    onValueChange={(value) => formik.setFieldValue("email", value)}
                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                    errorMessage={formik.errors.email}
                    onBlur={() => {
                        formik.setFieldTouched("email")
                    }}
                    onClear={() => {}}
                />
            </div>
            {/* Button submit */}
            <ButtonStyled
                type="submit"
                className="w-110 h-10 mx-auto mt-4"
                isLoading={formik.isSubmitting}
                color="primary"
                isDisabled={!formik.isValid}
                // onPress={() => formik.submitForm()}
            >
                {t("auth.send_otp")}
            </ButtonStyled>

            <p className="text-small text-center">
                {t("auth.back_to")}&nbsp;
                <Link isBlock onPress={handleOpenLogin} className="cursor-pointer">
                    {t("login.login")}
                </Link>
            </p>
        </form>
    )
}
