"use client"

import { NumberInputStyled, TableStyled } from "@/components"
import { CreateDispatchReq } from "@/models/dispatch/schema/request"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useFormik } from "formik"
import React, { Key, useState } from "react"
import { useTranslation } from "react-i18next"

type TableSelectionVehicleModelProps = {
    selectionBehavior?: "toggle" | "replace"
    vehicleModels: VehicleModelViewRes[]
    formik: ReturnType<typeof useFormik<CreateDispatchReq>>
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionVehicleModel({
    selectionBehavior,
    // stationId,
    vehicleModels,
    formik,
    onChangeSelected
}: TableSelectionVehicleModelProps) {
    const { t } = useTranslation()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    // const [filter, setFilter] = useState<StaffReq>({ stationId })
    // const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    // const { data, isLoading } = useGetAllVehicles({
    //     params: { stationId, status: VehicleStatus.Available },
    //     pagination
    // })

    const rows = vehicleModels.map((item, index) => ({
        id: item.id,
        index: index,
        model: item.name
    }))

    const columns = [
        {
            key: "no",
            label: t("table.no")
        },
        {
            key: "model",
            label: t("table.vehicle_model").toUpperCase()
        },
        {
            key: "numberOfVehicle",
            label: t("dispatch.number_vehicle").toUpperCase()
        }
    ]

    const handleSelectionChange = (keys: Key[]) => {
        const ids = keys.map(String)
        setSelectedKeys(ids)
        onChangeSelected?.(keys.map(String))
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                <TableStyled
                    selectionBehavior={selectionBehavior}
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={(keys) => {
                        let selected: Key[]

                        if (keys === "all") {
                            selected = rows.map((r) => r.id)
                        } else {
                            selected = Array.from(keys)
                        }

                        handleSelectionChange(selected)
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows}>
                        {(item) => {
                            const error =
                                formik.touched.vehicles?.[item.index]?.numberOfVehicle &&
                                (formik.errors.vehicles?.[item.index] as any)?.numberOfVehicle
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.index + 1}</TableCell>
                                    <TableCell>{item.model}</TableCell>
                                    <TableCell>
                                        <NumberInputStyled
                                            // label={t("dispatch.number_vehicle")}
                                            min={0}
                                            className="w-full"
                                            classNames={{
                                                inputWrapper: "h-10"
                                            }}
                                            value={
                                                formik.values.vehicles[item.index]?.numberOfVehicle
                                            }
                                            onValueChange={(val) => {
                                                const num = Number(val)
                                                formik.setFieldValue(
                                                    `vehicles[${item.index}].numberOfVehicle`,
                                                    isNaN(num) ? undefined : num
                                                )
                                            }}
                                            onBlur={() =>
                                                formik.setFieldTouched(
                                                    `vehicles[${item.index}].numberOfVehicle`,
                                                    true
                                                )
                                            }
                                            isInvalid={!!error}
                                            errorMessage={error}
                                            // isDisabled={!selectedKeys.includes(item.id)}
                                            hideStepper
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        }}
                    </TableBody>
                </TableStyled>
            </div>
            {/* <div className="mt-6 flex justify-center">
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
            </div> */}
        </>
    )
}
