"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../../styled/ButtonStyled"
import { VehicleChecklistItemViewRes } from "@/models/checklist/schema/response"
import { DamageStatusLabels } from "@/constants/labels"
import { Camera } from "lucide-react"
import Link from "next/link"

export function TableCheckList({
    vehicleCheckListItem,
    onStatusChange
}: {
    vehicleCheckListItem?: VehicleChecklistItemViewRes[]
    onStatusChange?: () => void
}) {
    const { t } = useTranslation()
    // const { acceptContract, rejectContract } = useConfirmContract({ onSuccess: onStatusChange })

    // const handleAccept = useCallback(
    //     (id: string) => {
    //         acceptContract.mutateAsync({ id })
    //     },
    //     [acceptContract]
    // )

    // const handleReject = useCallback(
    //     (id: string, status: VehicleStatus) => {
    //         rejectContract.mutateAsync({ id, vehicalStatus: status })
    //     },
    //     [rejectContract]
    // )

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table
                aria-label="Vehicle checklist table"
                className="min-w-full text-sm md:text-base"
                removeWrapper
            >
                <TableHeader>
                    <TableColumn className="text-center text-gray-700 font-semibold w-12">
                        STT
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        Component Name
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        Condition
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        Notes
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {vehicleCheckListItem.map((item, index) => (
                        <TableRow
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                            {/* STT */}
                            <TableCell className="text-center text-gray-700 font-medium">
                                {index + 1}
                            </TableCell>

                            {/* Component name */}
                            <TableCell className="text-center text-gray-800 font-semibold">
                                {item.component.name}
                            </TableCell>

                            {/* Damage Status */}
                            <TableCell className="text-center">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        item.status === 0
                                            ? "bg-green-100 text-green-700"
                                            : item.status === 1
                                            ? "bg-yellow-100 text-yellow-700"
                                            : item.status === 2
                                            ? "bg-orange-100 text-orange-700"
                                            : item.status === 3
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {DamageStatusLabels[item.status]}
                                </span>
                            </TableCell>

                            {/* Notes */}
                            <TableCell className="text-center text-gray-600 text-sm italic">
                                {item.notes || "—"}
                            </TableCell>

                            {/* Action */}
                            <TableCell className="text-center">
                                <Link href="/">
                                    <ButtonStyled
                                        color="primary"
                                        className="bg-gradient-to-r from-primary to-teal-400 
                             hover:from-teal-500 hover:to-green-400 
                             text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1"
                                        onPress={() =>
                                            console.log(`Upload image for ${item.component.name}`)
                                        }
                                    >
                                        <Camera size={18} fontWeight="fill" />
                                        Upload
                                    </ButtonStyled>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
