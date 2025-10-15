"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Paperclip } from "@phosphor-icons/react"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"

import { ButtonStyled } from "../ButtonStyled"
import { UserProfileViewRes } from "@/models/user/schema/response"

type TableUserManagementProps = {
    users: UserProfileViewRes[]
    onPreviewDocument?: (doc: { label: string; url: string }) => void
    onEditUser?: (user: UserProfileViewRes) => void
}

export function TableUserManagement({
    users,
    onPreviewDocument,
    onEditUser
}: TableUserManagementProps) {
    const { t } = useTranslation()

    const tableRows = useMemo(() => {
        return users.map((user, index) => {
            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()

            const documents = [
                {
                    key: "citizen",
                    label: t("user.citizen_identity"),
                    url: user.citizenUrl
                },
                {
                    key: "driver",
                    label: t("user.driver_license"),
                    url: user.licenseUrl
                }
            ]

            return (
                <TableRow
                    key={user.email ?? user.phone ?? `user-${index}`}
                    className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50"
                >
                    <TableCell className="py-3 px-4 text-gray-900 font-medium">
                        {fullName || "-"}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-700">{user.phone ?? "-"}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-700">{user.email ?? "-"}</TableCell>
                    <TableCell className="py-3 px-4 text-gray-700">
                        <div className="flex flex-col gap-1">
                            {documents.map((doc) =>
                                doc.url ? (
                                    <button
                                        key={doc.key}
                                        type="button"
                                        onClick={() =>
                                            doc.url &&
                                            onPreviewDocument?.({
                                                label: doc.label,
                                                url: doc.url
                                            })
                                        }
                                        className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-primary transition hover:bg-primary/20"
                                    >
                                        <Paperclip size={14} weight="duotone" />
                                        <span className="text-xs font-medium">{doc.label}</span>
                                    </button>
                                ) : (
                                    <span
                                        key={doc.key}
                                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600"
                                    >
                                        <span className="font-semibold">X</span>
                                        {doc.label}
                                    </span>
                                )
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                        <ButtonStyled
                            className="rounded-lg border border-emerald-400 bg-emerald-50 px-4 py-1 text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-100 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                            onPress={() => onEditUser?.(user)}
                        >
                            {t("common.edit")}
                        </ButtonStyled>
                    </TableCell>
                </TableRow>
            )
        })
    }, [onEditUser, onPreviewDocument, t, users])

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table
                aria-label="User Management Table"
                className="min-w-full table-fixed text-sm"
                removeWrapper
            >
                <TableHeader>
                    <TableColumn className="py-3 px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.name")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.phone")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.email")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.documents")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={
                        <span className="py-8 text-gray-500">{t("staff.user_management_empty")}</span>
                    }
                >
                    {tableRows}
                </TableBody>
            </Table>
        </div>
    )
}
