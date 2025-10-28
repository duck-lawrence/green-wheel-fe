"use client"
import {
    ButtonStyled,
    CitizenIdentityProfile,
    DatePickerStyled,
    EnumPicker,
    InputStyled,
    SpinnerStyled,
    ButtonIconStyled,
    AvatarProfile
} from "@/components"
import { useDay, useGetMe, useUserHelper, useUpdateMe } from "@/hooks"
import { UserUpdateReq } from "@/models/user/schema/request"
import { NotePencilIcon } from "@phosphor-icons/react/dist/ssr"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
import { DriverLicenseProfile } from "@/components/shared/Profile/DriverLicenseProfile"

export default function ProfilePage() {
    const { t } = useTranslation()
    const [editable, setEditable] = useState(false)
    const { toDate, formatDateTime } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const { toFullName } = useUserHelper()
    const { data: user } = useGetMe()
    const updateMeMutation = useUpdateMe({ onSuccess: undefined })

    // ===== Update Me =====
    const handleUpdateMe = useCallback(
        async (values: UserUpdateReq) => {
            await updateMeMutation.mutateAsync(values)
            setEditable(!editable)
        },
        [updateMeMutation, editable, setEditable]
    )

    const updateMeFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phone: user?.phone || undefined,
            sex: user?.sex || Sex.Male,
            dateOfBirth: user?.dateOfBirth || ""
        },
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
        onSubmit: handleUpdateMe
    })

    if (!user) return <SpinnerStyled />

    return (
        <div className="px-4">
            {/* Title */}
            <div className="text-3xl mb-8 font-bold">{t("user.account_information")}</div>

            <div className="flex flex-col sm:flex-row justify-between sm:gap-6 mb-8 items-center">
                {/* Avatar */}
                <AvatarProfile user={user} />

                {/* Preview info */}
                <div>
                    {/* Top container */}
                    <div className="flex justify-between items-center">
                        {/* user full name */}
                        <div
                            className="text-3xl" //
                        >
                            {`${toFullName({
                                firstName: user.firstName,
                                lastName: user.lastName
                            })} ${user.station != null ? `- ${user.station?.name}` : ""}`}
                        </div>

                        {/* Button enable show change */}
                        <div>
                            {!editable ? (
                                <ButtonIconStyled
                                    color="primary"
                                    variant="ghost"
                                    onPress={() => setEditable(!editable)}
                                >
                                    <NotePencilIcon />
                                </ButtonIconStyled>
                            ) : (
                                <div className="flex gap-2">
                                    <ButtonStyled
                                        color="primary"
                                        variant="ghost"
                                        isLoading={updateMeFormik.isSubmitting}
                                        isDisabled={
                                            !updateMeFormik.isValid || !updateMeFormik.dirty
                                        }
                                        onPress={updateMeFormik.submitForm}
                                    >
                                        {t("common.save")}
                                    </ButtonStyled>
                                    <ButtonStyled
                                        isDisabled={updateMeFormik.isSubmitting}
                                        onPress={() => {
                                            setEditable(!editable)
                                            updateMeFormik.resetForm()
                                        }}
                                    >
                                        {t("common.cancel")}
                                    </ButtonStyled>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form for update */}
                    <form
                        onSubmit={updateMeFormik.submitForm}
                        className="flex flex-col mt-5 gap-2 lg:min-w-xl max-w-xl"
                    >
                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                            <InputStyled
                                isReadOnly={!editable}
                                label={t("user.last_name")}
                                variant="bordered"
                                value={updateMeFormik.values.lastName}
                                onValueChange={(value) =>
                                    updateMeFormik.setFieldValue("lastName", value)
                                }
                                isInvalid={
                                    editable &&
                                    !!(
                                        updateMeFormik.touched.lastName &&
                                        updateMeFormik.errors.lastName
                                    )
                                }
                                errorMessage={updateMeFormik.errors.lastName}
                                onBlur={() => {
                                    updateMeFormik.setFieldTouched("lastName")
                                }}
                            />

                            <InputStyled
                                isReadOnly={!editable}
                                label={t("user.first_name")}
                                variant="bordered"
                                value={updateMeFormik.values.firstName}
                                onValueChange={(value) =>
                                    updateMeFormik.setFieldValue("firstName", value)
                                }
                                isInvalid={
                                    editable &&
                                    !!(
                                        updateMeFormik.touched.firstName &&
                                        updateMeFormik.errors.firstName
                                    )
                                }
                                errorMessage={updateMeFormik.errors.firstName}
                                onBlur={() => {
                                    updateMeFormik.setFieldTouched("firstName")
                                }}
                            />
                        </div>

                        <div className="flex justify-center flex-wrap sm:flex-nowrap gap-2">
                            {/* Phone */}
                            <InputStyled
                                isRequired
                                isReadOnly={!editable}
                                variant="bordered"
                                label={t("user.phone")}
                                maxLength={10}
                                value={updateMeFormik.values.phone}
                                onValueChange={(value) =>
                                    updateMeFormik.setFieldValue("phone", value)
                                }
                                isInvalid={
                                    editable &&
                                    !!(updateMeFormik.touched.phone && updateMeFormik.errors.phone)
                                }
                                errorMessage={updateMeFormik.errors.phone}
                                onBlur={() => {
                                    updateMeFormik.setFieldTouched("phone")
                                }}
                            />

                            <EnumPicker
                                isReadOnly={!editable}
                                label={t("user.sex")}
                                labels={SexLabels}
                                value={updateMeFormik.values.sex}
                                onChange={(val) => updateMeFormik.setFieldValue("sex", val)}
                            />

                            <DatePickerStyled
                                isRequired
                                isReadOnly={!editable}
                                label={t("user.date_of_birth")}
                                isInvalid={
                                    editable &&
                                    !!(
                                        updateMeFormik.touched.dateOfBirth &&
                                        updateMeFormik.errors.dateOfBirth
                                    )
                                }
                                errorMessage={updateMeFormik.errors.dateOfBirth}
                                value={
                                    updateMeFormik.values.dateOfBirth
                                        ? toDate(updateMeFormik.values.dateOfBirth)
                                        : null
                                }
                                onChange={(value) => {
                                    if (!value) {
                                        updateMeFormik.setFieldValue("dateOfBirth", null)
                                        return
                                    }

                                    const dob = formatDateTime({ date: value })

                                    updateMeFormik.setFieldValue("dateOfBirth", dob)
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <CitizenIdentityProfile user={user} />
            <DriverLicenseProfile user={user} />
            {/* <BankInfoProfile user={user} /> */}
        </div>
    )
}
