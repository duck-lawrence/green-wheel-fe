"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
    AutocompleteStyle,
    ButtonStyled,
    EnumPicker,
    InputStyled,
    TableContractStaff
} from "@/components"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useGetAllRentalContracts, useGetAllStations } from "@/hooks"
import { useFormik } from "formik"
import { FunnelSimple, MapPinAreaIcon } from "@phosphor-icons/react"
import { RentalContractStatusLabels } from "@/constants/labels"
import { ContractQueryParams } from "@/models/rental-contract/schema/request"
import { BackendError } from "@/models/common/response"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { AutocompleteItem } from "@heroui/react"

export default function StaffContractsPage() {
    const { t } = useTranslation()

    const [contracts, setContracts] = useState<RentalContractViewRes[]>([])
    const { getCachedOrFetch, isFetching } = useGetAllRentalContracts()
    const {
        data: stations,
        isLoading: isGetStationsLoading,
        error: getStationsError
    } = useGetAllStations()

    const handleFilterChange = useCallback(
        async (params: ContractQueryParams) => {
            const data = await getCachedOrFetch(params)
            setContracts(data || [])
        },
        [getCachedOrFetch]
    )

    const formik = useFormik<ContractQueryParams>({
        initialValues: {},
        // validationSchema,
        onSubmit: handleFilterChange
    })

    // Load station
    useEffect(() => {
        if (getStationsError) {
            const error = getStationsError as BackendError
            toast.error(translateWithFallback(t, error.detail))
        }
    }, [getStationsError, isGetStationsLoading, stations, t])

    useEffect(() => {
        formik.submitForm()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                            className="btn-gradient px-6 py-2 rounded-lg"
                        >
                            {t("staff.handovers_filters_search")}
                        </ButtonStyled>
                    </div>

                    {/* Filter inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                        <AutocompleteStyle
                            label={t("vehicle_model.station")}
                            items={stations}
                            startContent={<MapPinAreaIcon className="text-xl" />}
                            selectedKey={formik.values.stationId}
                            onSelectionChange={(id) => {
                                formik.setFieldValue("stationId", id)
                                formik.handleSubmit()
                            }}
                        >
                            {(stations ?? []).map((item) => (
                                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                            ))}
                        </AutocompleteStyle>
                        <EnumPicker
                            label={t("table.status")}
                            labels={RentalContractStatusLabels}
                            value={formik.values.status ?? null}
                            onChange={(val) => {
                                formik.setFieldValue("status", val)
                                formik.handleSubmit()
                            }}
                        />
                        <InputStyled
                            label={t("table.phone")}
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue("phone", value.target.value)}
                            onClear={() => formik.setFieldValue("phone", "")}
                        />
                        <InputStyled
                            label={t("table.citizen_id")}
                            value={formik.values.citizenIdentityNumber}
                            onChange={(value) =>
                                formik.setFieldValue("citizenIdentityNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("citizenIdentityNumber", "")}
                        />
                        <InputStyled
                            label={t("table.driver_license")}
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
            <TableContractStaff contracts={contracts} params={formik.values} />
        </div>
    )
}
