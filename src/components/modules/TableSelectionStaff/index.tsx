"use client"

import { PaginationStyled } from "@/components/styled"
import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { useGetAllStaffs } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { Spinner } from "@heroui/react"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

type TableSelectionStaffProps = {
    selectionBehavior?: "toggle" | "replace"
    stationId: string
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionStaff({
    selectionBehavior,
    stationId,
    onChangeSelected
}: TableSelectionStaffProps) {
    const { t } = useTranslation()

    const [selectedSatffIds, setSelectedStaffIds] = useState<string[]>([])
    // const [filter, setFilter] = useState<StaffReq>({ stationId })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const { data, isLoading } = useGetAllStaffs({
        params: { stationId },
        pagination
    })

    const rows = (data?.items || []).map((item, index) => ({
        key: item.id,
        id: index + 1,
        name: `${item.firstName} ${item.lastName}`,
        station: item.station?.name
    }))

    const columns = [
        {
            key: "id",
            label: t("table.no")
        },
        {
            key: "name",
            label: t("table.name").toUpperCase()
        },
        {
            key: "station",
            label: t("station.station").toUpperCase()
        }
    ]

    const handleSelectionChange = (keys: React.Key[]) => {
        const ids = keys.map(String)
        setSelectedStaffIds(ids)
        onChangeSelected?.(ids)
    }

    if (isLoading) return <Spinner />

    return (
        <>
            <TableSelectionStyled
                rows={rows}
                columns={columns}
                selectedKeys={selectedSatffIds}
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
                />
            </div>
        </>
    )
}
