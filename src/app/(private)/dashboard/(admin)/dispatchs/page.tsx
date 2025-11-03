"use client"
import { ButtonIconStyled, EnumPicker, SpinnerStyled, TableStyled } from "@/components"
import { DispatchRequestStatusColorMap } from "@/constants/colorMap"
import { DispatchRequestStatus } from "@/constants/enum"
import { DispatchRequestStatusLabels } from "@/constants/labels"
import { useGetAllDispatch, useGetAllStations, useGetMe, useNavigateOnClick } from "@/hooks"
import { DispatchQueryParams } from "@/models/dispatch/schema/request"
import { Chip, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { EyeIcon, Plus } from "lucide-react"

import Link from "next/link"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchPage() {
    const handleNavigateClick = useNavigateOnClick()
    const { t } = useTranslation()
    const { data: user } = useGetMe()
    const { data: stations = [] } = useGetAllStations()
    const [filter, setFilter] = useState<DispatchQueryParams>({ toStation: user?.station?.id })
    const { data: dispatches, isLoading } = useGetAllDispatch({
        params: filter,
        enabled: true
    })

    return (
        <div className="max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
                <h1 className="text-3xl font-bold">{t("table.dispatch_managerment")}</h1>
                <Link href="/dashboard/dispatchs/new">
                    {/* <ButtonStyled className="btn-gradient  text-white font-semibold">
                        + {t("table.create_dispatch")}
                    </ButtonStyled> */}
                    <ButtonIconStyled className="btn-gradient rounded-lg">
                        <Plus />
                    </ButtonIconStyled>
                </Link>
            </div>

            {/* Filter section */}
            <div className="w-fit mb-3">
                <EnumPicker
                    label={t("table.status")}
                    labels={DispatchRequestStatusLabels}
                    value={filter.status}
                    onChange={(val) => {
                        setFilter((prev) => {
                            return {
                                ...prev,
                                status: val as DispatchRequestStatus | undefined
                            }
                        })
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/70 shadow-sm">
                {isLoading ? (
                    <SpinnerStyled />
                ) : (
                    <TableStyled
                        aria-label={t("dispatch.dispatch_table")}
                        className="min-w-full text-sm md:text-base"
                        removeWrapper
                    >
                        <TableHeader>
                            <TableColumn className="text-center text-gray-700 font-semibold py-3">
                                STT
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold py-3">
                                {t("table.from_station")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold py-3">
                                {t("table.to_station")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold py-3">
                                {t("table.status")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold py-3">
                                {t("table.action")}
                            </TableColumn>
                        </TableHeader>

                        <TableBody>
                            {dispatches?.length ? (
                                dispatches.map((item, index) => {
                                    const fromStation =
                                        stations.find((s) => s.id === item.fromStationId)?.name ||
                                        "—"
                                    const toStation =
                                        stations.find((s) => s.id === item.toStationId)?.name || "—"
                                    const statusLabel = DispatchRequestStatusLabels[item.status]

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-white transition-all duration-200 border-b border-gray-200 cursor-pointer"
                                            onMouseDown={handleNavigateClick(
                                                `/dashboard/dispatchs/${item.id}`
                                            )}
                                        >
                                            <TableCell className="text-center text-gray-700 font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {fromStation}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {toStation}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Chip
                                                    variant="bordered"
                                                    color={
                                                        DispatchRequestStatusColorMap[item.status]
                                                    }
                                                >
                                                    {statusLabel}
                                                </Chip>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link href={`/dashboard/dispatchs/${item.id}`}>
                                                    <ButtonIconStyled
                                                        className="p-4"
                                                        variant="bordered"
                                                    >
                                                        <EyeIcon />
                                                    </ButtonIconStyled>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-10 text-gray-500 italic"
                                    >
                                        ...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </TableStyled>
                )}
            </div>
        </div>
    )
}
