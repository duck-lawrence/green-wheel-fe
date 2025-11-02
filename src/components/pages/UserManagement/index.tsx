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



export function UserManagement({ isCustomerManagement = true }: { isCustomerManagement: boolean }) {
    const { t } = useTranslation()

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
                      
                    </div>
                    <div className="flex items-center justify-between gap-2">
                       
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
                    showControls
                />
            </div>

            <EditUserModal user={editingUser} isOpen={isEditOpen} onClose={handleCloseEditUser} />
        </div>
    )
}
