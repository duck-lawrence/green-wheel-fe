"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../../styled/ButtonStyled"
import { VehicleChecklistItemViewRes } from "@/models/checklist/schema/response"
import { DamageStatusLabels } from "@/constants/labels"
import { Camera } from "lucide-react"
import Link from "next/link"
import { TextareaStyled } from "@/components/styled"
import { EnumPicker } from "../EnumPicker"

export function TableCheckList({
    vehicleCheckListItem,
    setFieldValue
}: {
    vehicleCheckListItem: VehicleChecklistItemViewRes[]
    setFieldValue: (field: string, value: any) => void
}) {
    const { t } = useTranslation()

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
                    {vehicleCheckListItem!.map((item, index) => (
                        <TableRow key={item.id} className="relative">
                            {/* STT */}

                            <TableCell className="text-center text-gray-700 font-medium">
                                {index + 1}
                            </TableCell>

                            {/* Component name */}
                            <TableCell className="text-center text-gray-800 font-semibold ">
                                {item.component.name}
                            </TableCell>

                            {/* Damage Status */}
                            <TableCell className="text-center">
                                <EnumPicker
                                    className="max-w-38"
                                    label={t("table.status")}
                                    labels={DamageStatusLabels}
                                    value={item.status}
                                    onChange={(val) =>
                                        setFieldValue(`checklistItems[${index}].status`, val)
                                    }
                                />
                            </TableCell>

                            {/* Notes */}
                            <TableCell className="text-center text-gray-600 text-sm italic">
                                <TextareaStyled
                                    value={item.notes}
                                    onChange={(v) =>
                                        setFieldValue(
                                            `checklistItems[${index}].notes`,
                                            v.target.value
                                        )
                                    }
                                />
                            </TableCell>

                            {/* Action */}
                            <TableCell className="text-center flex justify-center pt-7">
                                <ButtonStyled
                                    color="primary"
                                    className="text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center"
                                >
                                    <Camera size={18} fontWeight="fill" />
                                    <Link href="/">Upload</Link>
                                </ButtonStyled>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
