import { EnumPicker } from "@/components/modules"
import { ButtonStyled, InputStyled } from "@/components/styled"
import { RentalContractStatus } from "@/constants/enum"
import { RentalContractStatusLabels } from "@/constants/labels"
import { useFormik } from "formik"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
export default function FilterContractStaff() {
    const { t } = useTranslation()

    const initialValues = useMemo(
        () => ({
            status: RentalContractStatus,
            phone: "",
            citizenIdentity: "",
            driverLicense: ""
        }),
        []
    )

    const validationSchema = useMemo(() => {
        return Yup.object({
            status: Yup.string(),
            phone: Yup.string(),
            emcitizenIdentityil: Yup.string(),
            driverLicense: Yup.string()
        })
    }, [])

    const handlesubmit = useCallback(
        async (values: {
            status: RentalContractStatus
            phone: string
            citizenIdentity: string
            driverLicense: string
        }) => {
            await console.log(values)
        },
        []
    )

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handlesubmit
    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <EnumPicker
                label={"Status"}
                labels={RentalContractStatusLabels}
                value={formik.values.status ?? " "}
                onChange={(val) => formik.setFieldValue("status", val)}
            />
            <InputStyled
                label={"Phone"}
                value={formik.values.phone}
                onChange={(val) => formik.setFieldValue("phone", val)}
            />
            <InputStyled
                label={"Citizen identity"}
                value={formik.values.citizenIdentity}
                onChange={(val) => formik.setFieldValue("citizenIdentity", val)}
            />
            <InputStyled
                label={"Driver license"}
                value={formik.values.driverLicense}
                onChange={(val) => formik.setFieldValue("driverLicense", val)}
            />
            <ButtonStyled type="submit">Search</ButtonStyled>
        </form>
    )
}
