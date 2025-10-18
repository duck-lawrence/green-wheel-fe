"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FunnelSimple } from "@phosphor-icons/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Selection } from "@heroui/react"

import {
    ButtonStyled,
    EditUserModal,
    FilterTypeStyle,
    FilterTypeOption,
    InputStyled,
    PaginationStyled,
    TableUserManagement,
    useModalDisclosure,
    CitizenIdentityPreviewModal,
    DriverLicensePreviewModal
} from "@/components"
import { ROLE_ADMIN, ROLE_STAFF } from "@/constants/constants"
import { useGetAllUsers } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"

type UserFilterFormValues = {
    name: string
    phone: string
    hasDocument: "both" | "license" | "citizen" | "none" | undefined
}

export default function StaffUserManagementPage() {
    const { t } = useTranslation()
    const [users, setUsers] = useState<UserProfileViewRes[]>([])
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 10
    const [clientFilters, setClientFilters] = useState<{
        name: string
        phone: string
        hasDocument: UserFilterFormValues["hasDocument"]
    }>({
        name: "",
        phone: "",
        hasDocument: undefined
    })
    const [previewDocument, setPreviewDocument] = useState<{
        user: UserProfileViewRes
        type: "citizen" | "driver"
    } | null>(null)
    const [editingUser, setEditingUser] = useState<UserProfileViewRes | null>(null)
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useModalDisclosure()

    const { data, isFetching } = useGetAllUsers({
        params: {},
        enabled: true
    })

    useEffect(() => {
        if (data) {
            setUsers(data)
        }
    }, [data])

    const initialValues = useMemo<UserFilterFormValues>(
        () => ({
            name: "",
            phone: "",
            hasDocument: undefined
        }),
        []
    )

    const validationSchema = useMemo(() => {
        return Yup.object({
            name: Yup.string().trim(),
            phone: Yup.string().trim(),
            hasDocument: Yup.mixed<UserFilterFormValues["hasDocument"]>()
                .oneOf(["both", "license", "citizen", "none"] as const)
                .optional()
        })
    }, [])

    const handleSubmit = useCallback((values: UserFilterFormValues) => {
        setClientFilters({
            name: values.name.trim().toLowerCase(),
            phone: values.phone.trim(),
            hasDocument: values.hasDocument
        })
        setPage(1)
    }, [])

    const formik = useFormik<UserFilterFormValues>({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit
    })

    const handleDocumentFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                formik.setFieldValue("hasDocument", undefined)
                return
            }

            const values = Array.from(keys)

            if (values.length === 0) {
                formik.setFieldValue("hasDocument", undefined)
                return
            }

            const key = values[0]
            const value = typeof key === "string" ? key : key != null ? key.toString() : undefined

            formik.setFieldValue("hasDocument", value as UserFilterFormValues["hasDocument"])
        },
        [formik]
    )

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const roleName = (user.role?.name ?? "").toLowerCase()
            if ([ROLE_STAFF.toLowerCase(), ROLE_ADMIN.toLowerCase()].includes(roleName)) {
                return false
            }

            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
            const fullNameLower = fullName.toLowerCase()

            const matchesName = clientFilters.name
                ? fullNameLower.includes(clientFilters.name)
                : true

            const matchesPhone = clientFilters.phone
                ? (user.phone ?? "").includes(clientFilters.phone)
                : true

            const matchesDocument = (() => {
                switch (clientFilters.hasDocument) {
                    case "both":
                        return Boolean(user.licenseUrl && user.citizenUrl)
                    case "license":
                        return Boolean(user.licenseUrl)
                    case "citizen":
                        return Boolean(user.citizenUrl)
                    case "none":
                        return !user.licenseUrl && !user.citizenUrl
                    default:
                        return true
                }
            })()

            return matchesName && matchesPhone && matchesDocument
        })
    }, [clientFilters.name, clientFilters.phone, clientFilters.hasDocument, users])

    const totalItems = filteredUsers.length
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

    useEffect(() => {
        setPage((prev) => Math.min(prev, totalPages))
    }, [totalPages])

    const paginatedUsers = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE)
    }, [filteredUsers, page, PAGE_SIZE])

    const handleOpenDocumentPreview = useCallback(
        (payload: {
            user: UserProfileViewRes
            type: "citizen" | "driver"
            url?: string | null
            label: string
        }) => {
            setPreviewDocument({ user: payload.user, type: payload.type })
        },
        []
    )

    const handleCloseDocumentPreview = useCallback(() => {
        setPreviewDocument(null)
    }, [])

    const handleDocumentStateUpdate = useCallback(
        (userId: string, type: "citizen" | "driver", nextUrl: string | null) => {
            setUsers((prev) =>
                prev.map((item) => {
                    if (item.id !== userId) return item
                    if (type === "citizen") {
                        return {
                            ...item,
                            citizenUrl: nextUrl ?? undefined
                        }
                    }
                    return {
                        ...item,
                        licenseUrl: nextUrl ?? undefined
                    }
                })
            )

            setPreviewDocument((prev) => {
                if (!prev || prev.user.id !== userId) return prev
                const updatedUser =
                    type === "citizen"
                        ? { ...prev.user, citizenUrl: nextUrl ?? undefined }
                        : { ...prev.user, licenseUrl: nextUrl ?? undefined }

                return { ...prev, user: updatedUser }
            })
        },
        []
    )

    const handleOpenEditUser = useCallback(
        (user: UserProfileViewRes) => {
            setEditingUser(user)
            onEditOpen()
        },
        [onEditOpen]
    )

    const handleCloseEditUser = useCallback(() => {
        setEditingUser(null)
        onEditClose()
    }, [onEditClose])

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-6">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("staff.user_management_title")}</p>
            </div>

            <div className="mb-4">
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col gap-6 md:gap-8"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FunnelSimple size={22} className="text-primary" />
                            {t("staff.user_filter_title")}
                        </h3>
                        <ButtonStyled
                            type="submit"
                            isLoading={isFetching}
                            className="btn-gradient px-6 py-2 rounded-lg"
                        >
                            {t("staff.handovers_filters_search")}
                        </ButtonStyled>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputStyled
                            label={t("table.name")}
                            placeholder={t("staff.user_filter_name_placeholder")}
                            value={formik.values.name}
                            onChange={(value) => formik.setFieldValue("name", value.target.value)}
                            onClear={() => formik.setFieldValue("name", "")}
                            classNames={{
                                inputWrapper:
                                    "border-2 border-gray-200 data-[hover=true]:border-primary data-[focus=true]:border-primary",
                                label: "text-gray-700",
                                input: "text-gray-900"
                            }}
                        />
                        <InputStyled
                            label={t("user.phone")}
                            placeholder={t("staff.user_filter_phone_placeholder")}
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue("phone", value.target.value)}
                            onClear={() => formik.setFieldValue("phone", "")}
                            classNames={{
                                inputWrapper:
                                    "border-2 border-gray-200 data-[hover=true]:border-primary data-[focus=true]:border-primary",
                                label: "text-gray-700",
                                input: "text-gray-900"
                            }}
                        />
                        <FilterTypeStyle
                            label={t("staff.user_filter_has_document_label")}
                            placeholder={t("staff.user_filter_has_document_placeholder")}
                            className="sm:w-52"
                            selectedKeys={
                                formik.values.hasDocument
                                    ? new Set([formik.values.hasDocument])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={handleDocumentFilterChange}
                        >
                            <FilterTypeOption key="both">
                                {t("staff.user_filter_has_document_both")}
                            </FilterTypeOption>
                            <FilterTypeOption key="license">
                                {t("staff.user_filter_has_document_license")}
                            </FilterTypeOption>
                            <FilterTypeOption key="citizen">
                                {t("staff.user_filter_has_document_citizen")}
                            </FilterTypeOption>
                            <FilterTypeOption key="none">
                                {t("staff.user_filter_has_document_none")}
                            </FilterTypeOption>
                        </FilterTypeStyle>
                    </div>
                </form>
            </div>

            <TableUserManagement
                users={paginatedUsers}
                onPreviewDocument={handleOpenDocumentPreview}
                onEditUser={handleOpenEditUser}
            />

            {totalItems > PAGE_SIZE ? ( //PAGE_SIZE = 10
                <div className="mt-6 flex justify-center">
                    <PaginationStyled
                        pageNumber={page}
                        totalItems={totalItems}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                </div>
            ) : null}

            {previewDocument && previewDocument.type === "citizen" ? (
                <CitizenIdentityPreviewModal
                    userId={previewDocument.user.id}
                    isOpen
                    imageUrl={previewDocument.user.citizenUrl}
                    onClose={handleCloseDocumentPreview}
                    onUpdated={(nextUrl) =>
                        handleDocumentStateUpdate(previewDocument.user.id, "citizen", nextUrl)
                    }
                />
            ) : null}

            {previewDocument && previewDocument.type === "driver" ? (
                <DriverLicensePreviewModal
                    userId={previewDocument.user.id}
                    isOpen
                    imageUrl={previewDocument.user.licenseUrl}
                    onClose={handleCloseDocumentPreview}
                    onUpdated={(nextUrl) =>
                        handleDocumentStateUpdate(previewDocument.user.id, "driver", nextUrl)
                    }
                />
            ) : null}

            <EditUserModal user={editingUser} isOpen={isEditOpen} onClose={handleCloseEditUser} />
        </div>
    )
}
