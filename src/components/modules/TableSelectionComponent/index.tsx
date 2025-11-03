"use client"

import React, { Key, useCallback, useEffect, useMemo, useState } from "react"
import { Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { PaginationStyled, TableSelectionStyled } from "@/components/styled"
import { VehicleComponentViewRes } from "@/models/component/response"
import { formatCurrency } from "@/utils/helpers/currency"

export type TableSelectionVehicleComponentProps = {
    items: VehicleComponentViewRes[]
    selectedIds: Set<string>
    onSelectionChange: (next: Set<string>) => void
    isLoading?: boolean
    error?: string
    pageSize?: number
    showContainer?: boolean
    page?: number
    totalPages?: number
    onPageChange?: (page: number) => void
}

export function TableSelectionVehicleComponent({
    items,
    selectedIds,
    onSelectionChange,
    isLoading = false,
    error,
    pageSize = 5,
    showContainer = false,
    page,
    totalPages: totalPagesProp,
    onPageChange
}: TableSelectionVehicleComponentProps) {
    // 1) i18n
    const { t } = useTranslation()

    // 2) pagination state (supports controlled + uncontrolled modes)
    const [localPage, setLocalPage] = useState(1)
    const isControlledPage = typeof page === "number"
    const currentPage = isControlledPage ? page! : localPage
    const isServerPaginated =
        typeof totalPagesProp === "number" && typeof onPageChange === "function"

    // 3) derived values (memo)
    const totalPages = useMemo(() => {
        if (typeof totalPagesProp === "number" && totalPagesProp > 0) {
            return totalPagesProp
        }
        return Math.max(1, Math.ceil(items.length / pageSize))
    }, [items.length, pageSize, totalPagesProp])

    const pagedItems = useMemo(() => {
        if (isServerPaginated) {
            return items
        }

        const start = (currentPage - 1) * pageSize
        return items.slice(start, start + pageSize)
    }, [isServerPaginated, items, currentPage, pageSize])

    const columns = useMemo(
        () => [
            { key: "no", label: t("table.no") },
            { key: "component", label: t("vehicle_component.component") },
            { key: "damageFee", label: t("vehicle_component.table_damage_fee") }
        ],
        [t]
    )

    const rows = useMemo(
        () =>
            pagedItems.map((component, index) => ({
                key: String(component.id),
                no: (currentPage - 1) * pageSize + index + 1,
                component: (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900">{component.name}</span>
                        {component.description ? (
                            <span className="text-xs text-slate-500 line-clamp-2">
                                {component.description}
                            </span>
                        ) : null}
                    </div>
                ),
                damageFee: `${formatCurrency(component.damageFee)}${"VNĐ"}`
            })),
        [pagedItems, currentPage, pageSize]
    )

    const showPagination = totalPages > 1
    const shouldWrap = showContainer && showPagination

    // 4) sync uncontrolled pagination when data size shrinks
    useEffect(() => {
        if (isControlledPage) return

        setLocalPage((prev) => {
            if (prev > totalPages) return totalPages
            if (prev < 1) return 1
            return prev
        })
    }, [isControlledPage, totalPages])

    // 5) callbacks
    const handleSelectionChange = useCallback(
        (keys: Key[]) => {
            onSelectionChange(new Set(keys.map(String)))
        },
        [onSelectionChange]
    )

    const handlePageChange = useCallback(
        (next: number) => {
            const clamped = next < 1 ? 1 : next > totalPages ? totalPages : next

            if (!isControlledPage) {
                setLocalPage(clamped)
            }

            onPageChange?.(clamped)
        },
        [isControlledPage, onPageChange, totalPages]
    )

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
        )
    }

    if (!rows.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
                {t("vehicle_component.table_empty")}
            </div>
        )
    }

    const tableContent = (
        <TableSelectionStyled
            columns={columns}
            rows={rows}
            selectedKeys={selectedIds}
            onSelectionChange={handleSelectionChange}
        />
    )

    const paginationContent = showPagination ? (
        <div className="mt-6 flex justify-center">
            <PaginationStyled
                page={currentPage}
                total={totalPages}
                showControls
                onChange={handlePageChange}
            />
        </div>
    ) : null

    if (shouldWrap) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                {tableContent}
                {paginationContent}
            </div>
        )
    }

    return (
        <>
            {tableContent}
            {paginationContent}
        </>
    )
}
