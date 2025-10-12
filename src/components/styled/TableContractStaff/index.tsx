"use client"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../ButtonStyled"
import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useConfirmContract } from "@/hooks"
import { EnumPicker } from "@/components/modules"
import { VehicleStatusLabels } from "@/constants/labels"

export function TableContractStaff({ contracts }: { contracts: RentalContractViewRes[] }) {
    const { t } = useTranslation()
    const [vehicalStatus, setVehicalStatus] = useState<VehicleStatus | null>(null)
    const { acceptContract, rejectContract } = useConfirmContract({})

    const handleAccept = useCallback(
        (id: string) => {
            acceptContract.mutateAsync({ id })
        },
        [acceptContract]
    )

    const handleReject = useCallback(
        (id: string) => {
            if (!vehicalStatus) return
            rejectContract.mutateAsync({ id, vehicalStatus })
        },
        [rejectContract, vehicalStatus]
    )

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table
                aria-label="Staff Contract Table"
                className="min-w-full text-sm md:text-base"
                removeWrapper
            >
                <TableHeader>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.id")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.name")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.pickup_time")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.return_time")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.pickup_address")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.status")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {contracts.map((item) => (
                        <TableRow
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                            <TableCell className="text-center text-gray-700">{item.id}</TableCell>
                            <TableCell className="text-center text-gray-700 font-medium">
                                {`${item.customer.firstName} ${item.customer.lastName}`}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                                {item.startDate}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                                {item.endDate}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                                {item.station.name}
                            </TableCell>
                            <TableCell className="text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        item.status === RentalContractStatus.RequestPending
                                            ? "bg-yellow-100 text-yellow-700"
                                            : item.status === RentalContractStatus.Completed
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </TableCell>

                            {/* ACTIONS */}
                            <TableCell className="text-center">
                                {item.status === RentalContractStatus.RequestPending ? (
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                                        <ButtonStyled
                                            color="primary"
                                            className=" bg-white hover:text-black hover:bg-primary
                                            border border-primary text-primary
                                            font-semibold px-4 py-7"
                                            onPress={() => handleAccept(item.id)}
                                        >
                                            Accept
                                        </ButtonStyled>

                                        <div className="flex flex-col md:flex-row items-center gap-2">
                                            <EnumPicker
                                                label="Reject"
                                                labels={VehicleStatusLabels}
                                                value={vehicalStatus ?? null}
                                                onChange={(val: VehicleStatus) => {
                                                    setVehicalStatus(val)
                                                    handleReject(item.id)
                                                }}
                                                className="w-36 overflow-hidden"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-sm">
                                        {t("table.no_action")}
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
