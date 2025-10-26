"use client"
// import BrandPicker from "@/components/modules/UserItem/BrandPicker"
import React, { useEffect, useState } from "react"
import { EnumPicker, PaginationStyled, TableStyled } from "@/components"
import { useTranslation } from "react-i18next"
import { Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useDay, useGetMyContracts } from "@/hooks"
import { RentalContractStatus } from "@/constants/enum"
import { BackendError } from "@/models/common/response"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { RentalContractStatusLabels } from "@/constants/labels"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { PaginationParams } from "@/models/common/request"

export default function RentalContractPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const [filters, setFilter] = useState<{ status?: RentalContractStatus }>({})
    const [pagination, setPagination] = useState<PaginationParams>({})

    const {
        data,
        isLoading: isContractsLoading,
        error: contractsError,
        refetch: refetchContracts
    } = useGetMyContracts({ status: filters.status, pagination })

    useEffect(() => {
        if (contractsError) {
            const backendErr = contractsError as BackendError
            toast.error(translateWithFallback(t, backendErr.detail))
        }
    }, [contractsError, t])

    return (
        <div className="py-8 md:px-12 max-w-screen shadow-2xs rounded-2xl bg-white text-center">
            <div className="text-3xl pb-6 font-bold text-center text-primary">
                <p>{t("user.rental_contracts")}</p>
            </div>

            <div className="mb-3 flex">
                <EnumPicker
                    label={t("table.status")}
                    labels={RentalContractStatusLabels}
                    value={filters.status}
                    onChange={async (key) => {
                        setFilter({
                            status: key == null ? undefined : (key as RentalContractStatus)
                        })
                        await refetchContracts()
                        setPagination((prev) => {
                            return {
                                ...prev,
                                pageNumber: 1
                            }
                        })
                    }}
                    className="max-w-48"
                />

                {/* <form onSubmit={filterFormik.handleSubmit} className="flex gap-4 max-h-12">
                    <DateRangePickerStyled
                        label={t("table.pickup_return_time")}
                        onChange={(val) => {
                            if (!val) {
                                filterFormik.setFieldValue("start", null)
                                filterFormik.setFieldValue("end", null)
                                return
                            }

                            const startStr = val.start
                                ? dayjs(val.start.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                                : ""
                            const endStr = val.end
                                ? dayjs(val.end.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                                : ""

                            filterFormik.setFieldValue("start", startStr)
                            filterFormik.setFieldValue("end", endStr)
                            filterFormik.handleSubmit()
                        }}
                    />
                </form> */}
            </div>

            {isContractsLoading ? (
                <Spinner className="md:min-w-[60rem]" />
            ) : (
                <>
                    <TableStyled className="w-full md:min-w-[60rem] text-sm md:text-base">
                        <TableHeader>
                            <TableColumn className="text-center">{t("table.no")}</TableColumn>
                            <TableColumn className="text-center">
                                {t("table.vehicle_model")}
                            </TableColumn>
                            <TableColumn className="text-center">
                                {t("table.pickup_time")}
                            </TableColumn>
                            <TableColumn className="text-center">
                                {t("table.return_time")}
                            </TableColumn>
                            <TableColumn className="text-center">{t("table.station")}</TableColumn>
                            <TableColumn className="text-center">{t("table.status")}</TableColumn>
                        </TableHeader>

                        <TableBody>
                            {(data?.items ?? []).map((item, index) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                                    onClick={() => router.push(`/rental-contracts/${item.id}`)}
                                >
                                    <TableCell className="text-center text-gray-700">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.vehicle.model.name}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600">
                                        {item.startDate && formatDateTime({ date: item.startDate })}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600">
                                        {item.endDate && formatDateTime({ date: item.endDate })}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600">
                                        {item.station.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="py-1 rounded-full text-xs">
                                            {RentalContractStatusLabels[item.status]}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableStyled>
                    <div className="mt-6 flex justify-center">
                        <PaginationStyled
                            page={data?.pageNumber ?? 1}
                            total={data?.totalPages ?? 10}
                            onChange={(page: number) =>
                                setPagination((prev) => {
                                    return {
                                        ...prev,
                                        pageNumber: page
                                    }
                                })
                            }
                            showControls
                        />
                    </div>
                </>
            )}
        </div>
    )
}
