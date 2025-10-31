"use client"
import React, { useEffect, useState } from "react"
import {
    AutocompleteStyled,
    StepContract,
    EnumPicker,
    PaginationStyled,
    TableStyled
} from "@/components"
import { useTranslation } from "react-i18next"
import {
    AutocompleteItem,
    Spinner,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import { useRouter } from "next/navigation"
import { useDay, useGetAllStations, useGetMyContracts } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { RentalContractStatusLabels } from "@/constants/labels"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { PaginationParams } from "@/models/common/request"
import { RentalContractStatusColorMap } from "@/constants/colorMap"
import { addToast } from "@heroui/toast"
import { FunnelSimple, MapPinAreaIcon } from "@phosphor-icons/react"
import { ContractQueryParams } from "@/models/rental-contract/schema/request"
import { RentalContractStatus } from "@/constants/enum"

export default function RentalContractPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    const [filter, setFilter] = useState<ContractQueryParams>({})
    const [pagination, setPagination] = useState<PaginationParams>({})
    const {
        data,
        isLoading: isContractsLoading,
        error: contractsError,
        refetch
    } = useGetMyContracts({ ...filter, pagination })

    const {
        data: stations,
        isLoading: isGetStationsLoading,
        error: getStationsError
    } = useGetAllStations()

    useEffect(() => {
        const updateContracts = async () => {
            await refetch()
            setPagination((prev) => {
                return {
                    ...prev,
                    pageNumber: 1
                }
            })
        }

        updateContracts()
    }, [refetch, filter])

    useEffect(() => {
        if (contractsError || getStationsError) {
            const backendErr =
                (contractsError as BackendError) || (getStationsError as BackendError)
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, backendErr.detail),
                color: "danger"
            })
        }
    }, [contractsError, getStationsError, t])

    const status =
        data?.items.find((item) =>
            [
                RentalContractStatus.RequestPending,
                RentalContractStatus.PaymentPending,
                RentalContractStatus.Active,
                RentalContractStatus.Returned,
                RentalContractStatus.RefundPending
            ].includes(item.status)
        )?.status ?? undefined

    return (
        <div className="py-8 md:px-12 max-w-screen shadow-2xs rounded-2xl bg-white text-center">
            <div className="text-3xl pb-6 font-bold text-center text-primary">
                <p>{t("user.rental_bookings")}</p>
            </div>

            <div className="mb-3 px-4 flex flex-col ">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FunnelSimple size={22} className="text-primary" />
                        {t("staff.booking_filter")}
                    </h3>
                </div>
                <div className="flex gap-3">
                    <AutocompleteStyled
                        label={t("vehicle_model.station")}
                        items={stations}
                        startContent={<MapPinAreaIcon className="text-xl" />}
                        selectedKey={filter.stationId}
                        onSelectionChange={(id) => {
                            setFilter((prev) => {
                                return {
                                    ...prev,
                                    stationId: id ? (id as string) : undefined
                                }
                            })
                        }}
                        className="md:w-40"
                    >
                        {(stations ?? []).map((item) => (
                            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                        ))}
                    </AutocompleteStyled>
                    <EnumPicker
                        label={t("table.status")}
                        labels={RentalContractStatusLabels}
                        value={filter.status}
                        onChange={(val) => {
                            setFilter((prev) => {
                                return {
                                    ...prev,
                                    status: val ? (val as RentalContractStatus) : undefined
                                }
                            })
                        }}
                        className="md:w-56"
                    />
                </div>
            </div>

            <div className="flex justify-center ml-[6.5rem]">
                <StepContract status={status!} />
            </div>

            {isContractsLoading || isGetStationsLoading ? (
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
                                    onClick={() => router.push(`/rental-bookings/${item.id}`)}
                                >
                                    <TableCell className="text-center text-gray-700">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.vehicle?.model.name || "-"}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600">
                                        {item.startDate && formatDateTime({ date: item.startDate })}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600">
                                        {item.endDate && formatDateTime({ date: item.endDate })}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600">
                                        <span>{item.station.name}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                                                        ${
                                                            RentalContractStatusColorMap[
                                                                item.status
                                                            ]
                                                        }`}
                                        >
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
                        />
                    </div>
                </>
            )}
        </div>
    )
}
