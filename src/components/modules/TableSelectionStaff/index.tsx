"use client"

import { InputStyled, PaginationStyled, TableSelectionStyled } from "@/components/styled"
import { useGetAllStaffs, useUserHelper } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { DispatchStaffRes } from "@/models/dispatch/schema/response"
import { StaffReq } from "@/models/user/schema/request"
import { debouncedWrapper } from "@/utils/helpers/axiosHelper"
import { Spinner } from "@heroui/react"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

type TableSelectionStaffProps = {
    selectionBehavior?: "toggle" | "replace"
    stationId: string
    staffs?: DispatchStaffRes[]
    onChangeSelected?: (selected: string[]) => void
}

export function TableSelectionStaff({
    selectionBehavior,
    stationId,
    staffs = undefined,
    onChangeSelected
}: TableSelectionStaffProps) {
    const { t } = useTranslation()
    const { toFullName } = useUserHelper()

    const [selectedSatffIds, setSelectedStaffIds] = useState<string[]>([])
    const [filter, setFilter] = useState<StaffReq>({ stationId })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const { data, isLoading } = useGetAllStaffs({
        params: filter,
        pagination,
        enabled: !staffs
    })

    const [isTyping, setIsTyping] = useState(false)
    const debouncedSearch = useMemo(
        () =>
            debouncedWrapper(
                async (params: StaffReq) => {
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
            staffs === undefined
                ? data?.items.map((item, index) => ({
                      key: item.id,
                      id: index + 1,
                      name: toFullName({
                          firstName: item.firstName,
                          lastName: item.lastName
                      })
                  }))
                : staffs.map((item, index) => ({
                      key: item.staff.id,
                      id: index + 1,
                      name: toFullName({
                          firstName: item.staff.firstName,
                          lastName: item.staff.lastName
                      })
                  }))
        if (!items) return []

        return items
    }, [data?.items, staffs, toFullName])

    const columns = [
        {
            key: "id",
            label: t("table.no")
        },
        {
            key: "name",
            label: t("table.name").toUpperCase()
        }
        // {
        //     key: "station",
        //     label: t("station.station").toUpperCase()
        // }
    ]

    const handleSelectionChange = (keys: React.Key[]) => {
        const ids = keys.map(String)
        setSelectedStaffIds(ids)
        onChangeSelected?.(ids)
    }

    return (
        <>
            {!staffs && (
                <InputStyled
                    label={t("staff.name")}
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
                        selectedKeys={selectedSatffIds}
                        onSelectionChange={handleSelectionChange}
                        selectionBehavior={selectionBehavior}
                    ></TableSelectionStyled>
                    {!staffs && (
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
