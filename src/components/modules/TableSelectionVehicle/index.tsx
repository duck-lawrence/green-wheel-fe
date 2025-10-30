"use client"

import { PaginationStyled } from "@/components/styled"
import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleStatus } from "@/constants/enum"
import { useGetAllVehicles } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { Spinner } from "@heroui/react"
import React, { Key, useState } from "react"
import { useTranslation } from "react-i18next"

type TableSelectionVehicleProps = {
    selectionBehavior?: "toggle" | "replace"
    stationId: string
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionVehicle({
    selectionBehavior,
    stationId,
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
        model: item.model.name,
        licensePlate: item.licensePlate
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
            key: "licensePlate",
            label: t("vehicle.license_plate").toUpperCase()
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
            <TableSelectionStyled
                rows={rows}
                columns={columns}
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
                selectionBehavior={selectionBehavior}
            ></TableSelectionStyled>
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
                    showControls
                />
            </div>
        </>
    )
}
