"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { PencilSimple, TrashSimple } from "@phosphor-icons/react"

import { TableStyled } from "@/components"
import { VehicleComponentViewRes } from "@/models/component/response"
import { formatCurrency } from "@/utils/helpers/currency"

type TableVehicleComponentProps = {
  items: VehicleComponentViewRes[]
  isLoading?: boolean
  onEdit: (component: VehicleComponentViewRes) => void
  onDelete: (component: VehicleComponentViewRes) => void
}

export function TableVehicleComponent({
  items,
  isLoading = false,
  onEdit,
  onDelete
}: TableVehicleComponentProps) {
  const { t } = useTranslation()
  const tableRows = useMemo(() => {
    return items.map((component) => (
      <TableRow
        key={component.id}
        className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50"
      >
        <TableCell className="px-4 py-3 text-left font-semibold text-gray-900">
          {component.name}
        </TableCell>

        <TableCell className="px-4 py-3 text-left text-gray-700">
          <span className="line-clamp-2 sm:line-clamp-1">
            {component.description}
          </span>
        </TableCell>

        <TableCell className="px-4 py-3 text-left text-gray-700">
          {`${formatCurrency(component.damageFee)} ${"VNĐ"}`}
        </TableCell>

        <TableCell className="px-3 py-3 text-center">
          <div className="mx-auto flex w-full items-center justify-center gap-2">
            <button
              type="button"
              aria-label={t("common.edit")}
              onClick={() => onEdit(component)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 outline-none ring-0 transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <PencilSimple size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label={t("common.delete")}
              onClick={() => onDelete(component)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 outline-none ring-0 transition hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <TrashSimple size={16} weight="bold" />
            </button>
          </div>
        </TableCell>
      </TableRow>
    ))
  }, [items, onDelete, onEdit, t])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-16 shadow-sm">
        <Spinner size="lg" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center shadow-sm">
        <h3 className="text-base font-semibold text-slate-700">
          {t("vehicle_component.empty_state_title")}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {t("vehicle_component.empty_state_description")}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <TableStyled removeWrapper className="min-w-full table-fixed text-sm">
        <TableHeader>
          <TableColumn className="px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
            {t("vehicle_component.table_name")}
          </TableColumn>
          <TableColumn className="px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
            {t("vehicle_component.table_description")}
          </TableColumn>
          <TableColumn className="px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
            {t("vehicle_component.table_damage_fee")}
          </TableColumn>
          <TableColumn className="w-28 sm:w-32 px-3 text-center font-semibold uppercase tracking-wide text-gray-700">
            {t("vehicle_component.table_actions")}
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={<span className="py-8 text-gray-500">{t("vehicle_component.table_empty")}</span>}
        >
          {tableRows}
        </TableBody>
      </TableStyled>
    </div>
  )
}
