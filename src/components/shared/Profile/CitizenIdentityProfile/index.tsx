"use client"

import {
    ButtonStyled,
    DatePickerStyled,
    EnumPicker,
    ImageStyled,
    InputStyled,
    CitizenIdentityUploader,
    ButtonIconStyled
} from "@/components/"
import { Sex } from "@/constants/enum"
import { useDay, useGetMyCitizenId, useUpdateCitizenId } from "@/hooks"
import { Spinner } from "@heroui/react"
import { NotePencilIcon } from "@phosphor-icons/react"
import { useFormik } from "formik"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { SexLabels } from "@/constants/labels"
import { UpdateCitizenIdentityReq } from "@/models/citizen-identity/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"

export function CitizenIdentityProfile({ user }: { user: UserProfileViewRes }) {
    const { t } = useTranslation()
    const { toDate, formatDateTime } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const [editable, setEditable] = useState(false)
    const updateMutation = useUpdateCitizenId()
    // const deleteMutation = useDeleteCitizenId()

    const { data: citizenId, isLoading } = useGetMyCitizenId({
        enabled: !!user?.citizenUrl
    })

    const handleUpdateCitizenId = useCallback(
        async (req: UpdateCitizenIdentityReq) => {
            await updateMutation.mutateAsync(req)
            setEditable((prev) => !prev)
        },
        [updateMutation]
    )

    // const handleDelete = useCallback(async () => {
    //     await deleteMutation.mutateAsync()
    //     setEditable((prev) => !prev)
    // }, [deleteMutation])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            number: citizenId?.number || "",
            fullName: citizenId?.fullName || "",
            nationality: citizenId?.nationality || "",
            sex: citizenId?.sex || Sex.Male,
            dateOfBirth: citizenId?.dateOfBirth || "",
            expiresAt: citizenId?.expiresAt || ""
        },
        validationSchema: Yup.object({
            number: Yup.string().required(t("user.citizen_identity_number_require")),
            fullName: Yup.string().required(t("user.full_name_require")),
            nationality: Yup.string().required(t("user.nationality_require")),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require")),
            expiresAt: Yup.string().required(t("user.citizen_identity_expired_time_require"))
        }),
        onSubmit: handleUpdateCitizenId
    })

    return (
        <>
            <div className="flex flex-wrap justify-between text-2xl mb-2 font-bold">
                {t("user.citizen_identity")}
                {/* Button enable show change */}
                {citizenId && (
                    <div className="flex justify-end">
                        {!editable ? (
                            <ButtonIconStyled
                                color="primary"
                                variant="ghost"
                                onPress={() => setEditable(!editable)}
                            >
                                <NotePencilIcon />
                            </ButtonIconStyled>
                        ) : formik.isSubmitting ? (
                            <Spinner />
                        ) : (
                            <div className="flex flex-wrap items-end gap-2">
                                <CitizenIdentityUploader btnClassName="bg-secondary" />
                                <ButtonStyled
                                    color="primary"
                                    variant="ghost"
                                    isLoading={formik.isSubmitting}
                                    isDisabled={!formik.isValid || !formik.dirty}
                                    onPress={formik.submitForm}
                                >
                                    {t("common.save")}
                                </ButtonStyled>
                                {/* <ButtonStyled
                                // className="border-primary
                                //     bg-white border text-primary
                                //     hover:text-white hover:bg-primary"
                                isLoading={deleteMutation.isPending}
                                onPress={handleDelete}
                            >
                                {t("common.delete")}
                            </ButtonStyled> */}
                                <ButtonStyled
                                    isDisabled={
                                        formik.isSubmitting
                                        // deleteMutation.isPending
                                    }
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
                )}
            </div>
            <div className="mb-8">
                {isLoading ? (
                    <Spinner />
                ) : !citizenId ? (
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-center text-md mt-[-0.75rem]">
                        <p>{t("user.please_upload_citizen_identity")}</p>
                        <CitizenIdentityUploader />
                    </div>
                ) : (
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-3">
                        <div>
                            <ImageStyled
                                alt={t("user.citizen_identity")}
                                src={citizenId?.imageUrl}
                                width={400}
                                height={250}
                            />
                        </div>
                        <div className="w-120">
                            <form className="flex flex-col gap-2 mb-3" onSubmit={formik.submitForm}>
                                <InputStyled
                                    isRequired
                                    isReadOnly={!editable}
                                    label={t("user.no")}
                                    variant="bordered"
                                    value={formik.values.number}
                                    onValueChange={(value) => formik.setFieldValue("number", value)}
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
                                            !!(formik.touched.expiresAt && formik.errors.expiresAt)
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
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
