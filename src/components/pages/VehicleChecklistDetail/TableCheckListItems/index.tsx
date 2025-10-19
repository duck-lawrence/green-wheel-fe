"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { VehicleChecklistItemViewRes } from "@/models/checklist/schema/response"
import { DamageStatusLabels } from "@/constants/labels"
import { TextareaStyled, ChecklistItemUploader, EnumPicker } from "@/components/"

export function TableCheckListItems({
    isEditable = false,
    // checklistId,
    vehicleCheckListItem,
    setFieldValue
}: {
    isEditable: boolean
    // checklistId: string
    vehicleCheckListItem: VehicleChecklistItemViewRes[]
    setFieldValue: (field: string, value: any) => void
}) {
    const { t } = useTranslation()
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table className="min-w-full text-sm md:text-base" removeWrapper>
                <TableHeader>
                    <TableColumn className="text-center text-gray-700 font-semibold w-12">
                        {t("table.no")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-34">
                        {t("vehicle_component.component")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-38">
                        {t("table.status")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.notes")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-50">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {vehicleCheckListItem &&
                        vehicleCheckListItem.map((item, index) => {
                            return (
                                <TableRow key={item.id}>
                                    {/* No. */}
                                    <TableCell className="text-center align-top text-gray-700 font-medium">
                                        {index + 1}
                                    </TableCell>

                                    {/* Component name */}
                                    <TableCell className="text-center align-top text-gray-800 font-semibold">
                                        {item.component.name}
                                    </TableCell>

                                    {/* Damage Status */}
                                    <TableCell className="text-center align-top">
                                        <EnumPicker
                                            // className="max-w-30"
                                            label={t("table.status")}
                                            labels={DamageStatusLabels}
                                            value={item.status}
                                            onChange={(val) => {
                                                setFieldValue(
                                                    `checklistItems[${index}].status`,
                                                    val
                                                )
                                            }}
                                            isReadOnly={!isEditable}
                                            isClearable={false}
                                        />
                                    </TableCell>

                                    {/* Notes */}
                                    <TableCell className="text-center align-top text-gray-600 text-sm italic">
                                        <TextareaStyled
                                            value={item.notes || ""}
                                            onChange={(val) => {
                                                setFieldValue(
                                                    `checklistItems[${index}].notes`,
                                                    val.target.value
                                                )
                                            }}
                                            isReadOnly={!isEditable}
                                        />
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell className="flex justify-start items-center flex-col gap-2">
                                        {isEditable && (
                                            <ChecklistItemUploader
                                                key={item.id}
                                                itemId={item.id}
                                                itemImg={item.imageUrl}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </TableBody>
            </Table>
        </div>
    )
}
