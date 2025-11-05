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
    // vehicles: VehicleViewRes[]
    formik: ReturnType<typeof useFormik<CreateDispatchReq>>
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionVehicleModel({
    selectionBehavior,
    // stationId,
    vehicleModels,
    // vehicles,
    formik,
    onChangeSelected
}: TableSelectionVehicleModelProps) {
    const { t } = useTranslation()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    const rows = vehicleModels
        // .filter((m) => vehicles.filter((v) => v.model.id === m.id).length ?? 0 > 0)
        .map((item, index) => ({
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
            key: "quantity",
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
                    classNames={{
                        base: "max-h-[400px] overflow-scroll"
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows} emptyContent={t("dispatch.no_vehicles_requested")}>
                        {(item) => {
                            const error =
                                formik.touched.vehicles?.[item.index]?.quantity &&
                                (formik.errors.vehicles?.[item.index] as any)?.quantity

                            // const maxquantitys =
                            //     vehicles.filter((v) => v.model.id === item.id).length - 1

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.index + 1}</TableCell>
                                    <TableCell>{item.model}</TableCell>
                                    <TableCell>
                                        <NumberInputStyled
                                            // label={t("dispatch.number_vehicle")}
                                            minValue={0}
                                            // maxValue={maxquantitys}
                                            className="w-full"
                                            classNames={{
                                                inputWrapper: "h-10"
                                            }}
                                            value={formik.values.vehicles[item.index]?.quantity}
                                            // endContent={`/${maxquantitys}`}
                                            onValueChange={(val) => {
                                                const num = Number(val)
                                                formik.setFieldValue(
                                                    `vehicles[${item.index}].quantity`,
                                                    isNaN(num) ? undefined : num
                                                )
                                            }}
                                            onBlur={() =>
                                                formik.setFieldTouched(
                                                    `vehicles[${item.index}].quantity`,
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
        </>
    )
}
