"use client"

import { InputStyled, PaginationStyled } from "@/components/styled"
import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleStatus } from "@/constants/enum"
import { useGetAllVehicles } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { DispatchVehicleRes } from "@/models/dispatch/schema/response"
import { GetVehicleParams } from "@/models/vehicle/schema/request"
import { debouncedWrapper } from "@/utils/helpers/axiosHelper"
import { Spinner } from "@heroui/react"
import React, { Key, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

type TableSelectionVehicleProps = {
    selectionBehavior?: "toggle" | "replace"
    stationId: string
    vehicles?: DispatchVehicleRes[]
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionVehicle({
    selectionBehavior,
    stationId,
    vehicles = undefined,
    onChangeSelected
}: TableSelectionVehicleProps) {
    const { t } = useTranslation()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [filter, setFilter] = useState<GetVehicleParams>({
        stationId,
        status: VehicleStatus.Available
    })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const { data, isLoading } = useGetAllVehicles({
        params: filter,
        pagination,
        enabled: !vehicles
    })

    const [isTyping, setIsTyping] = useState(false)
    const debouncedSearch = useMemo(
        () =>
            debouncedWrapper(
                async (params: GetVehicleParams) => {
                    setFilter(params)
                },
                1000,
                () => setIsTyping(true),
                () => setIsTyping(false)
            ),
        []
    )

    const rows = useMemo(() => {
        const items =
            vehicles === undefined
                ? data?.items.map((item, index) => ({
                      key: item.id,
                      id: index + 1,
                      model: item.model.name,
                      licensePlate: item.licensePlate
                  }))
                : vehicles.map((item, index) => ({
                      key: item.vehicle.id,
                      id: index + 1,
                      model: item.vehicle.model.name,
                      licensePlate: item.vehicle.licensePlate
                  }))
        if (!items) return []

        return items
    }, [data?.items, vehicles])

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

    return (
        <>
            {!vehicles && (
                <InputStyled
                    label={t("vehicle.model_name")}
                    className="mb-3 w-60"
                    onChange={async (e) => {
                        await debouncedSearch({
                            ...filter,
                            name: e.target.value.trim()
                        })
                    }}
                />
            )}
            {isLoading || isTyping ? (
                <div className="text-center">
                    <Spinner />
                </div>
            ) : (
                <>
                    <TableSelectionStyled
                        rows={rows}
                        columns={columns}
                        selectedKeys={selectedKeys}
                        onSelectionChange={handleSelectionChange}
                        selectionBehavior={selectionBehavior}
                    ></TableSelectionStyled>
                    {!vehicles && (
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
                    )}
                </>
            )}
        </>
    )
}
