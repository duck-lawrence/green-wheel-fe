"use client"

import React from "react"
import { PencilSimple } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

import { ButtonStyled } from "@/components"
import { VehicleComponentViewRes } from "@/models/component/response"
import { formatCurrency } from "@/utils/helpers/currency"

type TableFleetComponentProps = {
  items: VehicleComponentViewRes[]
  isLoading: boolean
  onEditComponents?: () => void
  isEditDisabled?: boolean
}

export function TableFleetComponent({
  items,
  isLoading,
  onEditComponents,
  isEditDisabled
}: TableFleetComponentProps) {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="pl-5 text-2xl font-bold uppercase tracking-wide text-slate-950">
          {t("fleet.detail_component_section_title")}
        </h2>

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <div className="flex items-center gap-2">
            <ButtonStyled
              variant="light"
              onPress={() => onEditComponents?.()}
              className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 shadow-none transition-all hover:bg-slate-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              startContent={<PencilSimple size={16} weight="bold" />}
              isDisabled={!onEditComponents || isEditDisabled}
            >
              {t("common.edit_components")}
            </ButtonStyled>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                {t("table.no")}
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                {t("vehicle_component.component")}
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                {t("vehicle_component.table_damage_fee")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm text-slate-500">
                  {t("fleet.detail_component_table_loading")}
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((component, index) => (
                <tr key={component.id} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{index + 1}</td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-900">{component.name}</span>
                      {component.description ? (
                        <span className="text-xs text-slate-500">{component.description}</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-900">
                    {`${formatCurrency(component.damageFee)} ${t("currency.vnd")}`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm text-slate-500">
                  {t("fleet.detail_component_table_empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
