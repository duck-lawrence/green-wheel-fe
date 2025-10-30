"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"

import {
    EditUserModal,
    InputStyled,
    PaginationStyled,
    CustomerTable,
    useModalDisclosure,
    CreateUserModal,
    StaffTable,
    ButtonIconStyled
} from "@/components"
import { useCreateNewUser, useGetAllUsers } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { RoleName } from "@/constants/enum"
import { Plus, SearchIcon } from "lucide-react"
import { PaginationParams } from "@/models/common/request"
import { UserFilterParams } from "@/models/user/schema/request"
import { useDisclosure } from "@heroui/react"

// type UserFilterFormValues = {
//     name: string
//     phone: string
//     hasDocument?: "both" | "license" | "citizen" | "none"
// }

export function UserManagement({ isCustomerManagement = true }: { isCustomerManagement: boolean }) {
    const { t } = useTranslation()
    // const [previewDocument, setPreviewDocument] = useState<{
    //     user: UserProfileViewRes
    //     type: "citizen" | "driver"
    // } | null>(null)

    const [editingUser, setEditingUser] = useState<UserProfileViewRes | null>(null)
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useModalDisclosure()
    const roleName = useMemo(() => {
        return isCustomerManagement ? RoleName.Customer : RoleName.Staff
    }, [isCustomerManagement])

    const [filter, setFilter] = useState<UserFilterParams>({ roleName })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const { data, isLoading, refetch } = useGetAllUsers({
        params: filter,
        pagination,
        enabled: true
    })

    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onOpenChange: onCreateOpenchange,
        onClose: onCreateClose
    } = useDisclosure()
    const createMutation = useCreateNewUser({
        params: filter,
        pagination,
        onSuccess: onCreateClose
    })

    const validationSchema = useMemo(() => {
        return Yup.object({
            phone: Yup.string().trim(),
            citizenIdNumber: Yup.string().trim(),
            driverLicenseNumber: Yup.string().trim()
            // hasDocument: Yup.mixed<"both" | "license" | "citizen" | "none">()
            //     .oneOf(["both", "license", "citizen", "none"] as const)
            //     .optional()
        })
    }, [])

    const handleSubmit = useCallback(
        (values: UserFilterParams) => {
            setFilter({
                ...values,
                roleName
            })
            refetch()
            setPagination((prev) => {
                return {
                    ...prev,
                    pageNumber: 1
                }
            })
        },
        [refetch, roleName]
    )

    const formik = useFormik<UserFilterParams>({
        initialValues: filter,
        validationSchema,
        onSubmit: handleSubmit
    })

    // const handleDocumentFilterChange = useCallback(
    //     async (keys: Selection) => {
    //         if (keys === "all") {
    //             await formik.setFieldValue("hasDocument", undefined)
    //             formik.handleSubmit()
    //             return
    //         }

    //         const values = Array.from(keys)

    //         if (values.length === 0) {
    //             await formik.setFieldValue("hasDocument", undefined)
    //             formik.handleSubmit()
    //             return
    //         }

    //         const key = values[0]
    //         const value = typeof key === "string" ? key : key != null ? key.toString() : undefined

    //         await formik.setFieldValue("hasDocument", value as UserFilterFormValues["hasDocument"])
    //         formik.handleSubmit()
    //     },
    //     [formik]
    // )

    // ====================
    // Preview document modal
    // ====================

    // const handleOpenDocumentPreview = useCallback(
    //     (payload: {
    //         user: UserProfileViewRes
    //         type: "citizen" | "driver"
    //         url?: string | null
    //         label: string
    //     }) => {
    //         setPreviewDocument({ user: payload.user, type: payload.type })
    //     },
    //     []
    // )

    // const handleCloseDocumentPreview = useCallback(() => {
    //     setPreviewDocument(null)
    // }, [])

    // const handleDocumentStateUpdate = useCallback(
    //     (userId: string, type: "citizen" | "driver", nextUrl: string | null) => {
    //         setUsers((prev) =>
    //             prev.map((item) => {
    //                 if (item.id !== userId) return item
    //                 if (type === "citizen") {
    //                     return {
    //                         ...item,
    //                         citizenUrl: nextUrl ?? undefined
    //                     }
    //                 }
    //                 return {
    //                     ...item,
    //                     licenseUrl: nextUrl ?? undefined
    //                 }
    //             })
    //         )

    //         setPreviewDocument((prev) => {
    //             if (!prev || prev.user.id !== userId) return prev
    //             const updatedUser =
    //                 type === "citizen"
    //                     ? { ...prev.user, citizenUrl: nextUrl ?? undefined }
    //                     : { ...prev.user, licenseUrl: nextUrl ?? undefined }

    //             return { ...prev, user: updatedUser }
    //         })
    //     },
    //     []
    // )

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
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex justify-between flex-wrap gap-2"
                >
                    {/* Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputStyled
                            label={t("user.phone")}
                            // placeholder={t("staff.user_filter_phone_placeholder")}
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue("phone", value.target.value)}
                            onClear={() => formik.setFieldValue("phone", "")}
                        />
                        <InputStyled
                            label={t("user.citizen_identity")}
                            value={formik.values.citizenIdNumber}
                            onChange={(value) =>
                                formik.setFieldValue("citizenIdNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("citizenIdNumber", "")}
                        />
                        <InputStyled
                            label={t("user.driver_license")}
                            value={formik.values.driverLicenseNumber}
                            onChange={(value) =>
                                formik.setFieldValue("driverLicenseNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("driverLicenseNumber", "")}
                        />
                        {/* <FilterTypeStyle
                            label={t("staff.user_filter_has_document_label")}
                            placeholder={t("staff.user_filter_has_document_placeholder")}
                            // className="sm:w-52"
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
                        </FilterTypeStyle> */}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        {/* <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FunnelSimple size={22} className="text-primary" />
                            {t("staff.user_filter_title")}
                        </h3> */}
                        <ButtonIconStyled
                            type="submit"
                            isLoading={isLoading}
                            className="btn-gradient rounded-lg"
                        >
                            {/* {t("staff.handovers_filters_search")} */}
                            <SearchIcon />
                        </ButtonIconStyled>
                        <ButtonIconStyled
                            isLoading={isLoading}
                            className="btn-gradient rounded-lg"
                            onPress={onCreateOpen}
                        >
                            {/* {t("staff.handovers_filters_search")} */}
                            <Plus />
                        </ButtonIconStyled>

                        <CreateUserModal
                            isOpen={isCreateOpen}
                            onOpenChange={onCreateOpenchange}
                            createMutation={createMutation}
                            isCreateCustomer={isCustomerManagement}
                        />
                    </div>
                </form>
            </div>

            {isCustomerManagement ? (
                <CustomerTable
                    users={data?.items ?? []}
                    // onPreviewDocument={handleOpenDocumentPreview}
                    onEditUser={handleOpenEditUser}
                />
            ) : (
                <StaffTable staff={data?.items ?? []} onEditStaff={handleOpenEditUser} />
            )}

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

            {/* {previewDocument && previewDocument.type === "citizen" ? (
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
            ) : null} */}

            <EditUserModal user={editingUser} isOpen={isEditOpen} onClose={handleCloseEditUser} />
        </div>
    )
}
