"use client"
import { useFormik } from "formik"
import React from "react"
import * as Yup from "yup"
import { RentalContractStatus } from "@/constants/enum"
import { ButtonStyled, DateRangePickerStyled } from "@/components/styled"
import dayjs from "dayjs"
import { VehicalModelPicker } from "../VehicalModelPicker"
import { EnumPicker } from "@/components/modules/EnumPicker"
import { RentalContractStatusLabels } from "@/constants/labels"
import { DEFAULT_TIMEZONE } from "@/constants/constants"

export function FillterBarOrder({
    onFilterChange
}: {
    onFilterChange: ({ status }: { status?: RentalContractStatus }) => void
}) {
    const formik = useFormik({
        initialValues: {
            vehicalModelId: "",
            status: undefined,
            start: "",
            end: ""
        },
        validationSchema: Yup.object().shape({
            vehicalModelId: Yup.string(),
            status: Yup.number(),
            start: Yup.string(),
            end: Yup.string()
        }),
        onSubmit: (values) => {
            onFilterChange({ status: values.status })
        }
    })

    return (
        <form onSubmit={formik.handleSubmit} className="flex gap-4">
            <VehicalModelPicker
                value={formik.values.vehicalModelId}
                onChange={(val) => formik.setFieldValue("vehicalModelId", val)}
            />

            <EnumPicker
                value={formik.values.status || null}
                onChange={(val) => formik.setFieldValue("status", val)}
                labels={RentalContractStatusLabels}
                label="Status"
                className="max-w-55 h-14"
            />

            <DateRangePickerStyled
                label="Pick start date and end date"
                onChange={(val) => {
                    if (!val) {
                        formik.setFieldValue("start", null)
                        formik.setFieldValue("end", null)
                        return
                    }

                    const startStr = val.start
                        ? dayjs(val.start.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                        : ""
                    const endStr = val.end
                        ? dayjs(val.end.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                        : ""

                    formik.setFieldValue("start", startStr)
                    formik.setFieldValue("end", endStr)
                }}
            />
            <ButtonStyled type="submit" className="h-[56] w-40 ml-10">
                Search
            </ButtonStyled>
        </form>
    )
}
