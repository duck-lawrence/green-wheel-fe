"use client"

import {
    ButtonStyled,
    DatePickerStyled,
    EnumPicker,
    ImageStyled,
    InputStyled,
    DriverLicenseUploader
} from "@/components/"
import { Sex } from "@/constants/enum"
import { useDay, useGetMe, useGetMyDriverLicense } from "@/hooks"
import { Spinner } from "@heroui/react"
import { NotePencilIcon } from "@phosphor-icons/react"
import { useFormik } from "formik"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { LicenseClassLabels, SexLabels } from "@/constants/labels"

export function DriverLicenseProfile() {
    const { t } = useTranslation()
    const { toDate, formatDateTime } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const { data: user } = useGetMe()
    const [editable, setEditable] = useState(false)

    const { data: driverLicense, isLoading } = useGetMyDriverLicense({
        enabled: !!user?.licenseUrl
    })

    const handleUpdateCitizenId = useCallback(() => console.log("hehe"), [])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            number: driverLicense?.number || "",
            fullName: driverLicense?.fullName || "",
            class: driverLicense?.class || null,
            nationality: driverLicense?.nationality || "",
            sex: driverLicense?.sex || Sex.Male,
            dateOfBirth: driverLicense?.dateOfBirth || "",
            expiresAt: driverLicense?.expiresAt || ""
        },
        validationSchema: Yup.object({
            number: Yup.string().required(t("user.driver_license_number_require")),
            fullName: Yup.string().required(t("user.full_name_require")),
            class: Yup.number().required(t("user.driver_license_class_require")),
            nationality: Yup.string().required(t("user.nationality_require")),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require")),
            expiresAt: Yup.string().required(t("user.driver_license_expired_time_require"))
        }),
        onSubmit: handleUpdateCitizenId
    })
    return (
        <>
            <div className="text-2xl mb-4 font-bold">{t("user.driver_license")}</div>
            <div className="mb-8">
                {isLoading ? (
                    <Spinner />
                ) : !driverLicense ? (
                    <div className="flex justify-between items-center text-md px-4 italic mt-[-0.75rem]">
                        <p>{t("user.please_upload_driver_license")}</p>
                        <DriverLicenseUploader />
                    </div>
                ) : (
                    <div className="flex justify-between items-start">
                        <ImageStyled
                            alt={t("user.driver_license")}
                            src={driverLicense?.imageUrl}
                            width={400}
                            height={250}
                        />
                        <div>
                            <div>
                                <form
                                    className="flex flex-col min-w-100 max-w-100 gap-2 mb-3"
                                    onSubmit={formik.submitForm}
                                >
                                    <InputStyled
                                        isRequired
                                        isReadOnly={!editable}
                                        label={t("user.no")}
                                        variant="bordered"
                                        value={formik.values.number}
                                        onValueChange={(value) =>
                                            formik.setFieldValue("number", value)
                                        }
                                        isInvalid={
                                            editable &&
                                            !!(formik.touched.number && formik.errors.number)
                                        }
                                        errorMessage={formik.errors.number}
                                        onBlur={() => {
                                            formik.setFieldTouched("number")
                                        }}
                                    />

                                    <InputStyled
                                        isRequired
                                        isReadOnly={!editable}
                                        label={t("user.full_name")}
                                        variant="bordered"
                                        value={formik.values.fullName}
                                        onValueChange={(value) =>
                                            formik.setFieldValue("fullName", value)
                                        }
                                        isInvalid={
                                            editable &&
                                            !!(formik.touched.fullName && formik.errors.fullName)
                                        }
                                        errorMessage={formik.errors.fullName}
                                        onBlur={() => {
                                            formik.setFieldTouched("fullName")
                                        }}
                                    />

                                    <div className="flex justify-between gap-2">
                                        <EnumPicker
                                            isReadOnly={!editable}
                                            label={t("user.sex")}
                                            labels={SexLabels}
                                            value={formik.values.sex}
                                            onChange={(val) => formik.setFieldValue("sex", val)}
                                        />

                                        <EnumPicker
                                            isReadOnly={!editable}
                                            label={t("user.class")}
                                            labels={LicenseClassLabels}
                                            value={formik.values.class}
                                            onChange={(val) => formik.setFieldValue("class", val)}
                                        />

                                        <InputStyled
                                            isRequired
                                            isReadOnly={!editable}
                                            label={t("user.nationality")}
                                            variant="bordered"
                                            value={formik.values.nationality}
                                            onValueChange={(value) =>
                                                formik.setFieldValue("nationality", value)
                                            }
                                            isInvalid={
                                                editable &&
                                                !!(
                                                    formik.touched.nationality &&
                                                    formik.errors.nationality
                                                )
                                            }
                                            errorMessage={formik.errors.nationality}
                                            onBlur={() => {
                                                formik.setFieldTouched("nationality")
                                            }}
                                        />
                                    </div>

                                    <div className="flex justify-between gap-2">
                                        <DatePickerStyled
                                            isRequired
                                            isReadOnly={!editable}
                                            label={t("user.date_of_birth")}
                                            isInvalid={
                                                editable &&
                                                !!(
                                                    formik.touched.dateOfBirth &&
                                                    formik.errors.dateOfBirth
                                                )
                                            }
                                            errorMessage={formik.errors.dateOfBirth}
                                            value={
                                                formik.values.dateOfBirth
                                                    ? toDate(formik.values.dateOfBirth)
                                                    : null
                                            }
                                            onChange={(value) => {
                                                if (!value) {
                                                    formik.setFieldValue("dateOfBirth", null)
                                                    return
                                                }

                                                const dob = formatDateTime({ date: value })

                                                formik.setFieldValue("dateOfBirth", dob)
                                            }}
                                        />

                                        <DatePickerStyled
                                            isRequired
                                            isReadOnly={!editable}
                                            label={t("user.expires_at")}
                                            isInvalid={
                                                editable &&
                                                !!(
                                                    formik.touched.expiresAt &&
                                                    formik.errors.expiresAt
                                                )
                                            }
                                            errorMessage={formik.errors.expiresAt}
                                            value={
                                                formik.values.expiresAt
                                                    ? toDate(formik.values.expiresAt)
                                                    : null
                                            }
                                            onChange={(value) => {
                                                if (!value) {
                                                    formik.setFieldValue("expiresAt", null)
                                                    return
                                                }

                                                const dob = formatDateTime({ date: value })

                                                formik.setFieldValue("expiresAt", dob)
                                            }}
                                        />
                                    </div>
                                </form>

                                {/* Button enable show change */}
                                <div className="flex justify-end mb-3">
                                    {!editable ? (
                                        <ButtonStyled
                                            className="border-primary
                                            bg-white border text-primary   
                                            hover:text-white hover:bg-primary"
                                            onPress={() => setEditable(!editable)}
                                        >
                                            <div>
                                                <NotePencilIcon />
                                            </div>
                                            {t("user.edit_information")}
                                        </ButtonStyled>
                                    ) : (
                                        <div className="flex gap-2">
                                            <ButtonStyled
                                                className="border-primary 
                                                bg-white border text-primary 
                                                hover:text-white hover:bg-primary"
                                                isLoading={formik.isSubmitting}
                                                isDisabled={!formik.isValid || !formik.dirty}
                                                onPress={formik.submitForm}
                                            >
                                                {t("common.update")}
                                            </ButtonStyled>
                                            <DriverLicenseUploader btnClassName="bg-secondary" />
                                            <ButtonStyled
                                                isDisabled={formik.isSubmitting}
                                                onPress={() => {
                                                    setEditable(!editable)
                                                    formik.resetForm()
                                                }}
                                            >
                                                {t("common.cancel")}
                                            </ButtonStyled>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
