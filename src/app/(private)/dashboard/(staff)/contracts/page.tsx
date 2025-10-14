"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled, EnumPicker, InputStyled, TableContractStaff } from "@/components"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useSearchRentalContracts } from "@/hooks"
import { useFormik } from "formik"
import * as Yup from "yup"
import { RentalContractStatus } from "@/constants/enum"
import { FunnelSimple } from "@phosphor-icons/react"
import { RentalContractStatusLabels } from "@/constants/labels"
import { ContractQueryParams } from "@/models/rental-contract/schema/request"

export default function StaffContractsPage() {
    const { t } = useTranslation()
    const [filters, setFilter] = useState<ContractQueryParams>({})
    const [contracts, setContracts] = useState<RentalContractViewRes[]>([])
    const { data, isFetching, refetch } = useSearchRentalContracts({
        params: filters,
        enabled: true
    })

    useEffect(() => {
        if (data) setContracts(data)
    }, [data])

    const handleFilterChange = useCallback(
        async (val: ContractQueryParams) => {
            setFilter(val)
            await refetch()
        },
        [refetch]
    )

    const initialValues = useMemo(
        () => ({
            status: undefined,
            phone: "",
            citizenIdentityNumber: "",
            driverLicenseNumber: ""
        }),
        []
    )

    const validationSchema = useMemo(() => {
        return Yup.object({
            status: Yup.mixed<RentalContractStatus>().nullable(),
            phone: Yup.string(),
            citizenIdentity: Yup.string(),
            driverLicense: Yup.string()
        })
    }, [])

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleFilterChange
    })

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-6">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("staff.sidebar_contracts")}</p>
            </div>

            <div className="mb-4">
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5 
                                 flex flex-col gap-6 md:gap-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FunnelSimple size={22} className="text-primary" />
                            {t("staff.contract_filter")}
                        </h3>
                        <ButtonStyled
                            type="submit"
                            isLoading={isFetching}
                            className="bg-gradient-to-r from-primary to-teal-400 
                                     hover:from-teal-500 hover:to-green-400 text-white 
                                     px-6 py-2 rounded-lg font-semibold transition-all"
                        >
                            {t("staff.handovers_filters_search")}
                        </ButtonStyled>
                    </div>

                    {/* Filter inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <EnumPicker
                            label={t("table.status")}
                            labels={RentalContractStatusLabels}
                            value={formik.values.status ?? null}
                            onChange={(val) => formik.setFieldValue("status", val)}
                        />
                        <InputStyled
                            label={t("table.phone")}
                            placeholder="e.g. 0901234567"
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue("phone", value.target.value)}
                            onClear={() => formik.setFieldValue("phone", "")}
                        />
                        <InputStyled
                            label={t("table.citizen_id")}
                            placeholder="e.g. 079123456789"
                            value={formik.values.citizenIdentityNumber}
                            onChange={(value) =>
                                formik.setFieldValue("citizenIdentityNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("citizenIdentityNumber", "")}
                        />
                        <InputStyled
                            label={t("table.driver_license")}
                            placeholder="e.g. 60K-99999"
                            value={formik.values.driverLicenseNumber}
                            onChange={(value) =>
                                formik.setFieldValue("driverLicenseNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("driverLicenseNumber", "")}
                        />
                    </div>
                </form>
            </div>
            {/* Table */}
            <TableContractStaff contracts={contracts} onStatusChange={() => refetch()} />
        </div>
    )
}
