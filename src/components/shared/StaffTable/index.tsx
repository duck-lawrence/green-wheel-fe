"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Paperclip } from "@phosphor-icons/react"
import { Skeleton, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { EyeIcon } from "lucide-react"
import { TableStyled, ButtonIconStyled, AvatarStyled } from "@/components"
import { useName } from "@/hooks"
import { DEFAULT_AVATAR_URL } from "@/constants/constants"

type DocumentKey = "citizen" | "driver"

type StaffUserManagementProps = {
    staff: UserProfileViewRes[]
    isLoading?: boolean
    emptyMessage?: string
    onPreviewDocument?: (payload: { user: UserProfileViewRes; type: DocumentKey }) => void
    onEditStaff?: (staff: UserProfileViewRes) => void
    isRefetching?: boolean
    refetchingMessage?: string
}

export function StaffTable({
    staff,
    isLoading = false,
    emptyMessage,
    onPreviewDocument,
    onEditStaff,
    isRefetching = false,
    refetchingMessage
}: StaffUserManagementProps) {
    const { t } = useTranslation()
    const { toFullName } = useName()

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
                <TableRow key={`skeleton-${index}`} className="h-20">
                    <TableCell className="text-center" colSpan={5}>
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </TableCell>
                </TableRow>
            ))
        }

        if (staff.length === 0) {
            return (
                <TableRow>
                    <TableCell
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                        {emptyMessage ?? t("staff_management.empty_state")}
                    </TableCell>
                </TableRow>
            )
        }

        return documentsByStaff.map(({ staff: item, documents }) => {
            const displayName = toFullName({
                firstName: item.firstName,
                lastName: item.lastName
            })

            return (
                <TableRow
                    key={item.id}
                    className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50"
                >
                    <TableCell className="px-6 py-4 text-left align-middle">
                        <div className="flex items-center gap-3 ml-5">
                            <AvatarStyled
                                src={item.avatarUrl || DEFAULT_AVATAR_URL}
                                name={displayName || item.email || ""}
                                className="h-10 w-10 flex-shrink-0 text-sm"
                                radius="full"
                            />
                            <div className="flex flex-col items-start text-left">
                                <span className="font-semibold text-slate-900">{displayName}</span>
                                <span className="text-sm text-slate-500">
                                    {item.email ?? t("staff_management.no_email")}
                                </span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-700">
                        {item.phone ?? t("staff_management.no_phone")}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-700">
                        {item.station?.name || ""}
                    </TableCell>
                    <TableCell className="text-center text-sm">
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
                    </TableCell>
                    <TableCell className="text-center">
                        <ButtonIconStyled className="p-4" onPress={() => onEditStaff?.(item)}>
                            <EyeIcon />
                        </ButtonIconStyled>
                    </TableCell>
                </TableRow>
            )
        })
    }

    return (
        <>
            <TableStyled className="min-w-full table-fixed text-sm" removeWrapper>
                <TableHeader className="bg-slate-50">
                    <TableColumn className="text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("staff_management.column_staff")}
                    </TableColumn>
                    <TableColumn className="text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("table.phone")}
                    </TableColumn>
                    <TableColumn className="text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("table.station")}
                    </TableColumn>
                    <TableColumn className="text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("table.documents")}
                    </TableColumn>
                    <TableColumn className="text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>
                <TableBody>{renderBody()}</TableBody>
            </TableStyled>
            {isRefetching ? (
                <div className="border-t border-slate-100 text-center text-xs text-slate-400">
                    {refetchingMessage ?? t("staff_management.refreshing")}
                </div>
            ) : null}
        </>
    )
}
