"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { EyeIcon, Paperclip } from "@phosphor-icons/react"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"

import { UserProfileViewRes } from "@/models/user/schema/response"
import { useName } from "@/hooks"
import { ButtonIconStyled, TableStyled } from "@/components"

type CustomerTableProps = {
    users: UserProfileViewRes[]
    onPreviewDocument?: (doc: { label: string; url: string }) => void
    onEditUser?: (user: UserProfileViewRes) => void
}

export function CustomerTable({ users, onPreviewDocument, onEditUser }: CustomerTableProps) {
    const { t } = useTranslation()
    const { toFullName } = useName()

    const tableRows = useMemo(() => {
        return users.map((user) => {
            const fullName = toFullName({
                firstName: user.firstName,
                lastName: user.lastName
            })

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
                    key={user.id}
                    className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50"
                >
                    <TableCell className="text-center text-gray-900 font-medium">
                        {fullName || "-"}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">{user.phone ?? "-"}</TableCell>
                    <TableCell className="text-center text-gray-700">{user.email ?? "-"}</TableCell>
                    <TableCell className="text-center text-gray-700">
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
                    <TableCell className="text-center">
                        <ButtonIconStyled className="p-4" onPress={() => onEditUser?.(user)}>
                            <EyeIcon />
                        </ButtonIconStyled>
                    </TableCell>
                </TableRow>
            )
        })
    }, [onEditUser, onPreviewDocument, t, toFullName, users])

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <TableStyled className="min-w-full table-fixed text-sm" removeWrapper>
                <TableHeader>
                    <TableColumn className="text-center font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.name")}
                    </TableColumn>
                    <TableColumn className="text-center font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.phone")}
                    </TableColumn>
                    <TableColumn className="text-center font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.email")}
                    </TableColumn>
                    <TableColumn className="text-center font-semibold uppercase tracking-wide text-gray-700">
                        {t("table.documents")}
                    </TableColumn>
                    <TableColumn className="text-center font-semibold uppercase tracking-wide text-gray-700 w-12">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={
                        <span className="py-8 text-gray-500">
                            {t("staff.user_management_empty")}
                        </span>
                    }
                >
                    {tableRows}
                </TableBody>
            </TableStyled>
        </div>
    )
}
