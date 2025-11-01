"use client";

import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";

import TableSelectionStyled from "@/components/styled/TableSelectionStyled";
import { PaginationStyled } from "@/components/styled";
import { VehicleComponentViewRes } from "@/models/component/response";
import { formatCurrency } from "@/utils/helpers/currency";

export type TableSelectionVehicleComponentProps = {
  items: VehicleComponentViewRes[];
  selectedIds: Set<string>;
  onSelectionChange: (next: Set<string>) => void;
  isLoading?: boolean;
  error?: string;
  pageSize?: number;
  showContainer?: boolean;
};

export function TableSelectionVehicleComponent({
  items,
  selectedIds,
  onSelectionChange,
  isLoading = false,
  error,
  pageSize = 5,
  showContainer = false
}: TableSelectionVehicleComponentProps) {
  // 1) i18n
  const { t } = useTranslation();

  // 2) local state
  const [page, setPage] = useState(1);

  // 3) derived values (memo)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const columns = useMemo(
    () => [
      { key: "no", label: t("table.no") },
      { key: "component", label: t("vehicle_component.component") },
      { key: "damageFee", label: t("vehicle_component.table_damage_fee") }
    ],
    [t]
  );

  const currencySuffix = t("currency.vnd");

  const rows = useMemo(
    () =>
      pagedItems.map((component, index) => ({
        key: String(component.id),
        no: (page - 1) * pageSize + index + 1,
        component: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-slate-900">{component.name}</span>
            {component.description ? (
              <span className="text-xs text-slate-500 line-clamp-2">{component.description}</span>
            ) : null}
          </div>
        ),
        damageFee: `${formatCurrency(component.damageFee)} ${currencySuffix}`
      })),
    [pagedItems, page, pageSize, currencySuffix]
  );

  const showPagination = totalPages > 1;
  const shouldWrap = showContainer || showPagination;

  // 4) effects (clamp page khi nguồn dữ liệu đổi)
  useEffect(() => {
    setPage((prev) => (prev > totalPages ? totalPages : prev < 1 ? 1 : prev));
  }, [totalPages]);

  // 5) callbacks
  const handleSelectionChange = useCallback(
    (keys: Key[]) => {
      onSelectionChange(new Set(keys.map(String)));
    },
    [onSelectionChange]
  );

  const handlePageChange = useCallback((next: number) => setPage(next), []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
        {t("vehicle_component.table_empty")}
      </div>
    );
  }

  const tableContent = (
    <TableSelectionStyled
      columns={columns}
      rows={rows}
      selectedKeys={selectedIds}
      onSelectionChange={handleSelectionChange}
    />
  );

  const paginationContent = showPagination ? (
    <div className="mt-6 flex justify-center">
      <PaginationStyled page={page} total={totalPages} showControls onChange={handlePageChange} />
    </div>
  ) : null;

  if (shouldWrap) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {tableContent}
        {paginationContent}
      </div>
    );
  }

  return (
    <>
      {tableContent}
      {paginationContent}
    </>
  );
}
