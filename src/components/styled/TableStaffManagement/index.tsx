"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Paperclip } from "@phosphor-icons/react"
import { Skeleton } from "@heroui/react"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { ButtonStyled } from "../ButtonStyled"
import { AvatarStyled } from "../AvatarStyled"

type DocumentKey = "citizen" | "driver"

type StaffUserManagementProps = {
    staff: UserProfileViewRes[]
    isLoading?: boolean
    emptyMessage?: string
    onPreviewDocument?: (payload: { user: UserProfileViewRes; type: DocumentKey }) => void
    onEditStaff?: (staff: UserProfileViewRes) => void
    renderStaffName?: (staff: UserProfileViewRes) => string
    getStationName?: (staff: UserProfileViewRes) => string
    isRefetching?: boolean
    refetchingMessage?: string
}

const defaultRenderName = (staff: UserProfileViewRes) => {
    const fallbackName = [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim()
    return fallbackName ?? ""
}

const defaultGetStationName = (staff: UserProfileViewRes, fallback: string) =>
    staff.station?.name ?? fallback

export function StaffUserManagement({
    staff,
    isLoading = false,
    emptyMessage,
    onPreviewDocument,
    onEditStaff,
    renderStaffName = defaultRenderName,
    getStationName,
    isRefetching = false,
    refetchingMessage
}: StaffUserManagementProps) {
    const { t } = useTranslation()

    const documentsByStaff = useMemo(() => {
        return staff.map((item) => {
            return {
                staff: item,
                documents: [
                    {
                        key: "citizen" as const,
                        label: t("user.citizen_identity"),
                        url: item.citizenUrl
                    },
                    {
                        key: "driver" as const,
                        label: t("user.driver_license"),
                        url: item.licenseUrl
                    }
                ]
            }
        })
    }, [staff, t])

    const renderBody = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="h-20">
                    <td className="px-6 py-4" colSpan={5}>
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </td>
                </tr>
            ))
        }

        if (staff.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                        {emptyMessage ?? t("staff_management.empty_state")}
                    </td>
                </tr>
            )
        }

        const resolveStationName =
            getStationName ??
            ((item: UserProfileViewRes) =>
                defaultGetStationName(item, t("staff_management.unknown_station")))

        return documentsByStaff.map(({ staff: item, documents }) => {
            const displayName = renderStaffName(item) || t("staff_management.unknown_name")
            const stationName = resolveStationName(item)

            return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <AvatarStyled
                                src={item.avatarUrl ?? undefined}
                                name={displayName}
                                radius="full"
                                className="h-12 w-12 text-sm"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">{displayName}</span>
                                <span className="text-sm text-slate-500">
                                    {item.email ?? t("staff_management.no_email")}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                        {item.phone ?? t("staff_management.no_phone")}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{stationName}</td>
                    <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col gap-2">
                            {documents.map((doc) =>
                                doc.url ? (
                                    <button
                                        key={doc.key}
                                        type="button"
                                        onClick={() =>
                                            onPreviewDocument?.({ user: item, type: doc.key })
                                        }
                                        className="flex w-full items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-left text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                                    >
                                        <Paperclip size={14} weight="duotone" />
                                        <span className="flex-1">{doc.label}</span>
                                    </button>
                                ) : (
                                    <div
                                        key={doc.key}
                                        className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-left text-xs font-semibold text-red-600"
                                    >
                                        <span className="text-sm font-bold leading-none">X</span>
                                        {doc.label}
                                    </div>
                                )
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <ButtonStyled
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-600 transition hover:bg-emerald-100"
                            onPress={() => onEditStaff?.(item)}
                        >
                            {t("common.edit")}
                        </ButtonStyled>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full table-fixed">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("staff_management.column_staff")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("table.phone")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("table.station")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("table.documents")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("table.action")}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{renderBody()}</tbody>
            </table>
            {isRefetching ? (
                <div className="border-t border-slate-100 px-6 py-3 text-center text-xs text-slate-400">
                    {refetchingMessage ?? t("staff_management.refreshing")}
                </div>
            ) : null}
        </div>
    )
}
