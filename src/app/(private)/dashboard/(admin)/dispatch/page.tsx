"use client"
import { ButtonIconStyled, ButtonStyled, SpinnerStyled, TableStyled } from "@/components"
import { DispatchRequestStatusLabels } from "@/constants/labels"
import { useGetAllDispatch, useGetAllStations, useGetMe } from "@/hooks"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { Plus } from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { useTranslation } from "react-i18next"

export default function DispatchPage() {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user } = useGetMe()
    const { data: stations = [] } = useGetAllStations()
    const { data: dispatches, isLoading } = useGetAllDispatch({
        params: { toStation: user?.station?.id },
        enabled: true
    })

    if (isLoading) return <SpinnerStyled />

    return (
        <div className="max-w-6xl mx-auto w-full bg-white p-10 rounded-2xl shadow-md border border-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
                <h1 className="text-3xl font-bold text-primary tracking-wide">
                    {t("table.dispatch_managerment")}
                </h1>
                <Link href="/dashboard/dispatch/new">
                    {/* <ButtonStyled className="btn-gradient btn-gradient:hover btn-gradient:active text-white font-semibold">
                        + {t("table.create_dispatch")}
                    </ButtonStyled> */}
                    <ButtonIconStyled className="btn-gradient rounded-lg">
                        <Plus />
                    </ButtonIconStyled>
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/70 shadow-sm">
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
                                    stations.find((s) => s.id === item.fromStationId)?.name || "—"
                                const toStation =
                                    stations.find((s) => s.id === item.toStationId)?.name || "—"
                                const statusLabel = DispatchRequestStatusLabels[item.status]

                                const statusColor =
                                    item.status === 0
                                        ? "bg-yellow-100 text-yellow-700"
                                        : item.status === 1
                                        ? "bg-blue-100 text-blue-700"
                                        : item.status === 3
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"

                                return (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-white transition-all duration-200 border-b border-gray-200 cursor-pointer"
                                        onClick={() =>
                                            router.push(`/dashboard/dispatch/${item.id}`)
                                        }
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
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/dashboard/dispatch/${item.id}`}>
                                                <ButtonStyled className="text-primary border border-primary bg-white hover:bg-primary hover:text-white font-semibold px-5 py-1.5 rounded-lg transition-all duration-300">
                                                    {t("table.view_detail")}
                                                </ButtonStyled>
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
            </div>
        </div>
    )
}
