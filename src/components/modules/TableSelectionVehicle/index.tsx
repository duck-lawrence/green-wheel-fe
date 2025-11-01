"use client"

import { NumberInputStyled, PaginationStyled, TableStyled } from "@/components/styled"
import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleStatus } from "@/constants/enum"
import { useGetAllVehicles } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import {
    getKeyValue,
    Spinner,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import { useFormik } from "formik"
import React, { Key, useState } from "react"
import { useTranslation } from "react-i18next"

type TableSelectionVehicleProps = {
    selectionBehavior?: "toggle" | "replace"
    stationId: string
    setFieldValue: ReturnType<typeof useFormik>["setFieldValue"]
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionVehicle({
    selectionBehavior,
    stationId,
    setFieldValue,
    onChangeSelected
}: TableSelectionVehicleProps) {
    const { t } = useTranslation()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    // const [filter, setFilter] = useState<StaffReq>({ stationId })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const { data, isLoading } = useGetAllVehicles({
        params: { stationId, status: VehicleStatus.Available },
        pagination
    })

    const rows = (data?.items || []).map((item, index) => ({
        key: item.id,
        id: index + 1,
        model: item.model.name
    }))

    const columns = [
        {
            key: "id",
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

    if (isLoading) return <Spinner />

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
                            selected = rows.map((r) => r.key)
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
                        {(item) => (
                            <TableRow key={item.key}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.model}</TableCell>
                                <TableCell>
                                    <NumberInputStyled
                                        label={t("dispatch.number_vehicle")}
                                        min={0}
                                        className="w-full"
                                        value={formik.values.numberOfStaff}
                                        onValueChange={(val) => {
                                            formik.setFieldValue(
                                                "numberOfStaff",
                                                Number.isNaN(val) ? undefined : val
                                            )
                                        }}
                                        onBlur={() => formik.setFieldTouched("numberOfStaff", true)}
                                        isInvalid={
                                            !!(
                                                formik.touched.numberOfStaff &&
                                                formik.errors.numberOfStaff
                                            )
                                        }
                                        errorMessage={formik.errors.numberOfStaff}
                                        hideStepper
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </TableStyled>
            </div>
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
    )
}
