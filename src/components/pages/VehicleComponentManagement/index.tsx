"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FunnelSimple } from "@phosphor-icons/react"
import { Plus, SearchIcon } from "lucide-react"
import { useFormik } from "formik"
import * as Yup from "yup"

import {
    ButtonIconStyled,
    CreateVehicleComponentModal,
    DeleteVehicleComponentModal,
    EditVehicleComponentModal,
    InputStyled,
    PaginationStyled,
    TableVehicleComponent,
    useModalDisclosure
} from "@/components"
import {
    useCreateVehicleComponent,
    useDeleteVehicleComponent,
    useGetVehicleComponents,
    useUpdateVehicleComponent
} from "@/hooks"
import { VehicleComponentViewRes } from "@/models/component/response"
import { GetVehicleComponentsParams } from "@/models/component/request"
import { PaginationParams } from "@/models/common/request"

export function VehicleComponentManagement() {
    const { t } = useTranslation()
    const [filter, setFilter] = useState<GetVehicleComponentsParams>({})
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 10, pageNumber: 1 })
    const [editingComponent, setEditingComponent] = useState<VehicleComponentViewRes | null>(null)
    const [deletingComponent, setDeletingComponent] = useState<VehicleComponentViewRes | null>(null)

    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onOpenChange: onCreateOpenChange,
        onClose: onCreateClose
    } = useModalDisclosure()

    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onOpenChange: onEditOpenChange,
        onClose: onEditClose
    } = useModalDisclosure()

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteOpenChange,
        onClose: onDeleteClose
    } = useModalDisclosure()

    const { data, isLoading, isFetching } = useGetVehicleComponents({
        params: filter,
        pagination,
        enabled: true
    })

    const createMutation = useCreateVehicleComponent({
        onSuccess: () => {
            onCreateClose()
        }
    })

    const updateMutation = useUpdateVehicleComponent({
        onSuccess: () => {
            onEditClose()
            setEditingComponent(null)
        }
    })

    const deleteMutation = useDeleteVehicleComponent({
        onSuccess: () => {
            onDeleteClose()
            setDeletingComponent(null)
        }
    })

    const validationSchema = useMemo(
        () =>
            Yup.object({
                name: Yup.string().trim()
            }),
        []
    )

    const formik = useFormik<{ name: string }>({
        initialValues: { name: "" },
        validationSchema,
        onSubmit: (values) => {
            const trimmed = values.name.trim()
            setFilter(trimmed ? { name: trimmed } : {})
            setPagination((prev) => ({ ...prev, pageNumber: 1 }))
        }
    })

    const handleOpenEdit = useCallback(
        (component: VehicleComponentViewRes) => {
            setEditingComponent(component)
            onEditOpen()
        },
        [onEditOpen]
    )

    const handleOpenDelete = useCallback(
        (component: VehicleComponentViewRes) => {
            setDeletingComponent(component)
            onDeleteOpen()
        },
        [onDeleteOpen]
    )

    const isListLoading = isLoading || isFetching
    const items = (data?.items ?? []) as VehicleComponentViewRes[]
    const currentPage = data?.pageNumber ?? pagination.pageNumber ?? 1
    const totalPages = data?.totalPages ?? 1
    const showPagination = totalPages > 1

    return (
        <div className="mb-12 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">
                    {t("vehicle_component.management_title")}
                </h1>
            </header>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-2 text-slate-800">
                        <FunnelSimple size={22} className="text-primary" />
                        <h3 className="text-lg font-semibold">
                            {t("vehicle_component.filter_title")}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:items-end">
                        <InputStyled
                            label={t("vehicle_component.filter_name_label")}
                            placeholder={t("vehicle_component.filter_name_placeholder")}
                            value={formik.values.name}
                            onChange={(event) => formik.setFieldValue("name", event.target.value)}
                            onClear={() => {
                                formik.resetForm()
                                setFilter({})
                                setPagination((prev) => ({ ...prev, pageNumber: 1 }))
                            }}
                            isClearable
                        />

                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                            <ButtonIconStyled
                                type="submit"
                                aria-label={t("common.search")}
                                className="btn-gradient rounded-lg"
                                isDisabled={isListLoading}
                            >
                                <SearchIcon />
                            </ButtonIconStyled>
                            <ButtonIconStyled
                                type="button"
                                onPress={onCreateOpen}
                                aria-label={t("vehicle_component.create_button")}
                                className="btn-gradient rounded-lg"
                            >
                                <Plus />
                            </ButtonIconStyled>
                        </div>
                    </div>
                </form>
            </div>

            <TableVehicleComponent
                items={items}
                isLoading={isListLoading}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
            />

            {showPagination && (
                <div className="flex justify-center">
                    <PaginationStyled
                        page={currentPage}
                        total={totalPages}
                        onChange={(nextPage: number) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageNumber: nextPage
                            }))
                        }
                        showControls
                    />
                </div>
            )}

            <CreateVehicleComponentModal
                isOpen={isCreateOpen}
                onOpenChange={onCreateOpenChange}
                onClose={onCreateClose}
                isSubmitting={createMutation.isPending}
                onSubmit={(payload) => createMutation.mutate(payload)}
            />

            <EditVehicleComponentModal
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                onClose={() => {
                    setEditingComponent(null)
                    onEditClose()
                }}
                isSubmitting={updateMutation.isPending}
                component={editingComponent}
                onSubmit={(payload) => {
                    if (!editingComponent) return
                    updateMutation.mutate({ id: editingComponent.id, payload })
                }}
            />

            <DeleteVehicleComponentModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                onClose={() => {
                    setDeletingComponent(null)
                    onDeleteClose()
                }}
                isSubmitting={deleteMutation.isPending}
                component={deletingComponent}
                onConfirm={() => {
                    if (!deletingComponent) return
                    deleteMutation.mutate(deletingComponent.id)
                }}
            />
        </div>
    )
}
