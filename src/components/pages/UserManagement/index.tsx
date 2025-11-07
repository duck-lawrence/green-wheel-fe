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
    ButtonIconStyled,
    CitizenIdentityPreviewModal,
    DriverLicensePreviewModal
} from "@/components"
import { useCreateNewUser, useGetAllUsers, useGetMe } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { RoleName } from "@/constants/enum"
import { Plus, SearchIcon } from "lucide-react"
import { PaginationParams } from "@/models/common/request"
import { UserFilterParams } from "@/models/user/schema/request"
import { useDisclosure } from "@heroui/react"
import clsx from "clsx"

// type UserFilterFormValues = {
//     name: string
//     phone: string
//     hasDocument?: "both" | "license" | "citizen" | "none"
// }

export function UserManagement() {
    const { t } = useTranslation()
    const { data: me } = useGetMe()

    const [previewDocument, setPreviewDocument] = useState<{
        user: UserProfileViewRes
        type: "citizen" | "driver"
    } | null>(null)

    const [editingUser, setEditingUser] = useState<UserProfileViewRes | null>(null)
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useModalDisclosure()
    const manageRoleName = useMemo(() => {
        switch (me?.role?.name) {
            case RoleName.SuperAdmin:
                return RoleName.Admin
            case RoleName.Admin:
                return RoleName.Staff
            default:
                return RoleName.Customer
        }
    }, [me?.role?.name])
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })

    const [filter, setFilter] = useState<UserFilterParams>({
        roleName: manageRoleName,
        stationId:
            manageRoleName === RoleName.Admin || manageRoleName === RoleName.Staff
                ? me?.station?.id
                : undefined
    })
    const { data, isLoading, refetch } = useGetAllUsers({
        params: filter,
        pagination
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
                roleName: manageRoleName
            })
            refetch()
            setPagination((prev) => {
                return {
                    ...prev,
                    pageNumber: 1
                }
            })
        },
        [refetch, manageRoleName]
    )

    const formik = useFormik<UserFilterParams>({
        initialValues: filter,
        validationSchema,
        onSubmit: handleSubmit
    })

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
    const handleOpenDocumentPreview = useCallback(
        (payload: { user: UserProfileViewRes; type: "citizen" | "driver" }) => {
            setPreviewDocument({ user: payload.user, type: payload.type })
            onOpen()
        },
        [onOpen]
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
        <div>
            <div className="text-3xl mb-6 font-bold">
                <p>
                    {manageRoleName === RoleName.Customer
                        ? t("staff.customer_management_title")
                        : manageRoleName === RoleName.Staff
                        ? t("admin.staff_management_title")
                        : t("super_admin.admin_management_title")}
                </p>
            </div>

            <div className="mb-4">
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex justify-between flex-wrap gap-2"
                >
                    {/* Filter */}
                    {manageRoleName === RoleName.Customer && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputStyled
                                id="input-phone"
                                label={t("user.phone")}
                                // placeholder={t("staff.user_filter_phone_placeholder")}
                                value={formik.values.phone}
                                onChange={(value) =>
                                    formik.setFieldValue("phone", value.target.value)
                                }
                                onClear={() => formik.setFieldValue("phone", "")}
                            />

                            <InputStyled
                                id="upload-cccd"
                                label={t("user.citizen_identity")}
                                value={formik.values.citizenIdNumber}
                                onChange={(value) =>
                                    formik.setFieldValue("citizenIdNumber", value.target.value)
                                }
                                onClear={() => formik.setFieldValue("citizenIdNumber", "")}
                            />
                            <InputStyled
                                id="upload-license"
                                label={t("user.driver_license")}
                                value={formik.values.driverLicenseNumber}
                                onChange={(value) =>
                                    formik.setFieldValue("driverLicenseNumber", value.target.value)
                                }
                                onClear={() => formik.setFieldValue("driverLicenseNumber", "")}
                            />
                        </div>
                    )}
                    <div
                        className={clsx(
                            "flex items-center justify-end gap-2",
                            manageRoleName !== RoleName.Customer && "w-full"
                        )}
                    >
                        <ButtonIconStyled
                            type="submit"
                            isLoading={isLoading}
                            className="btn-gradient rounded-lg"
                            hidden={manageRoleName !== RoleName.Customer}
                        >
                            <SearchIcon />
                        </ButtonIconStyled>
                        <ButtonIconStyled
                            isLoading={isLoading}
                            className="btn-gradient rounded-lg"
                            onPress={onCreateOpen}
                        >
                            <Plus />
                        </ButtonIconStyled>

                        <CreateUserModal
                            isOpen={isCreateOpen}
                            onOpenChange={onCreateOpenchange}
                            createMutation={createMutation}
                            isCreateCustomer={manageRoleName === RoleName.Customer}
                            createRoleName={manageRoleName}
                        />
                    </div>
                </form>
            </div>

            {manageRoleName === RoleName.Customer ? (
                <CustomerTable
                    users={data?.items ?? []}
                    onPreviewDocument={handleOpenDocumentPreview}
                    onEditUser={handleOpenEditUser}
                />
            ) : (
                <StaffTable staff={data?.items ?? []} onEditStaff={handleOpenEditUser} />
            )}

            {(data?.items?.length ?? 0) > 0 && (
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
            )}

            {previewDocument && previewDocument.type === "citizen" ? (
                <CitizenIdentityPreviewModal
                    user={previewDocument.user}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                />
            ) : null}

            {previewDocument && previewDocument.type === "driver" ? (
                <DriverLicensePreviewModal
                    user={previewDocument.user}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                />
            ) : null}

            <EditUserModal user={editingUser} isOpen={isEditOpen} onClose={handleCloseEditUser} />
        </div>
    )
}
