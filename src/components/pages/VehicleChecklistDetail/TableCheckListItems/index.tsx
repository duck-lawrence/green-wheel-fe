"use client"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner
} from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { VehicleChecklistItemViewRes } from "@/models/checklist/schema/response"
import { DamageStatusLabels } from "@/constants/labels"
import { TextareaStyled, ChecklistItemUploader, EnumPicker, ImageStyled } from "@/components/"

export function TableCheckListItems({
    isStaff = false,
    checklistId,
    vehicleCheckListItem,
    setFieldValue
}: {
    isStaff: boolean
    checklistId: string
    vehicleCheckListItem: VehicleChecklistItemViewRes[]
    setFieldValue: (field: string, value: any) => void
}) {
    const { t } = useTranslation()

    if (vehicleCheckListItem.length == 0) return <Spinner />

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
                    {vehicleCheckListItem!.map((item, index) => (
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
                                    isReadOnly={!isStaff}
                                    label={t("table.status")}
                                    labels={DamageStatusLabels}
                                    value={item.status}
                                    onChange={(val) =>
                                        setFieldValue(`checklistItems[${index}].status`, val)
                                    }
                                    isClearable={false}
                                />
                            </TableCell>

                            {/* Notes */}
                            <TableCell className="text-center align-top text-gray-600 text-sm italic">
                                <TextareaStyled
                                    isReadOnly={!isStaff}
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
                            <TableCell className="flex justify-start items-center flex-col gap-2">
                                {/* <ButtonStyled
                                    color="primary"
                                    className="text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center"
                                >
                                    <Camera size={18} fontWeight="fill" />
                                    <Link href="/">{t("common.update")}</Link>
                                </ButtonStyled> */}
                                {isStaff ?? (
                                    <ChecklistItemUploader
                                        key={item.id}
                                        checklistId={checklistId}
                                        itemId={item.id}
                                    />
                                )}
                                {item.imageUrl && (
                                    <ImageStyled
                                        alt={t("vehicle_checklist.item_image")}
                                        src={item.imageUrl}
                                        width={200}
                                        height={125}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
