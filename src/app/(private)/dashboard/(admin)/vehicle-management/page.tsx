"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Selection } from "@heroui/react"
import { FunnelSimple } from "@phosphor-icons/react"
import { SearchIcon, Plus } from "lucide-react"

import {
    ButtonStyled,
    ButtonIconStyled,
    FilterTypeOption,
    FilterTypeStyle,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled,
    PaginationStyled,
    TableVehicleManagement,
    useModalDisclosure
} from "@/components"

import { VehicleStatus } from "@/constants/enum"
import {
    VehicleModelViewRes,
    VehicleViewRes
} from "@/models/vehicle/schema/response"

import {
    useCreateVehicle,
    useDeleteVehicle,
    useGetAllStations,
    useGetAllVehicleModels,
    useGetAllVehicles,
    useUpdateVehicle
} from "@/hooks"

import {
    VehicleCreateModal,
    VehicleEditModal
} from "@/components/modals/Vehicle"

import {
    CreateVehicleReq,
    GetVehicleParams,
    UpdateVehicleReq
} from "@/models/vehicle/schema/request"

import { PaginationParams } from "@/models/common/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

type VehicleWithStatus = VehicleViewRes & {
    status?: VehicleStatus
    modelId?: string
}

type VehicleFilterFormValues = {
    licensePlate: string
    stationId: string | null
    status: string | null
}

type VehicleEditFormValues = {
    licensePlate: string
    stationId: string
    modelId: string
    status: string | null
}

// danh sách status dưới dạng number enum
const VEHICLE_STATUS_VALUES = Object.values(VehicleStatus).filter(
    (value): value is VehicleStatus => typeof value === "number"
)

export default function AdminVehicleManagementPage() {
    const { t } = useTranslation()

    // ====================
    // Local state
    // ====================

    const [filter, setFilter] = useState<GetVehicleParams>({})
    const [pagination, setPagination] = useState<PaginationParams>({
        pageSize: 10
    })

    // modal + item đang thao tác
    const [editingVehicle, setEditingVehicle] = useState<VehicleWithStatus | null>(null)
    const [deletingVehicle, setDeletingVehicle] = useState<VehicleWithStatus | null>(null)

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

    // ====================
    // Queries
    // ====================

    const { data: stations = [] } = useGetAllStations({ enabled: true })

    const {
        data: vehiclesPage,
        isFetching: isFetchingVehicles
    } = useGetAllVehicles({
        params: filter,
        pagination,
        enabled: true
    })

    const {
        data: vehicleModels = [],
        isFetching: isFetchingVehicleModels
    } = useGetAllVehicleModels({ query: {} })

    // ====================
    // Derived data (memo)
    // ====================

    // option cho station (dùng trong filter dropdown)
    const stationOptions = useMemo(
        () =>
            stations.map((station) => ({
                key: station.id,
                label: station.name
            })),
        [stations]
    )

    // option cho station ở create/edit modal
    const stationSelectOptions = useMemo(
        () =>
            stationOptions.map((option) => ({
                id: option.key,
                label: option.label
            })),
        [stationOptions]
    )

    // map stationId -> stationName để render table
    const stationNameById = useMemo(() => {
        return stations.reduce<Record<string, string>>((acc, station) => {
            acc[station.id] = station.name
            return acc
        }, {})
    }, [stations])

    // option cho status dropdown filter / edit modal
    const statusOptions = useMemo(
        () =>
            VEHICLE_STATUS_VALUES.map((status) => {
                const statusKey =
                    VehicleStatus[status]?.toString().toLowerCase() ?? "unknown"

                return {
                    key: status.toString(),
                    label: translateWithFallback(
                        t,
                        `vehicle.status_value_${statusKey}`
                    )
                }
            }),
        [t]
    )

    // map modelId -> full vehicle model info
    const vehicleModelsById = useMemo(() => {
        return vehicleModels.reduce<Record<string, VehicleModelViewRes>>(
            (acc, model) => {
                acc[model.id] = model
                return acc
            },
            {}
        )
    }, [vehicleModels])

    // option cho dropdown chọn model trong create / edit
    //Hiện Dropdown brandName + Model.Name 
    //  const vehicleModelOptions = useMemo(
    //     () =>
    //         vehicleModels.map((model) => {
    //             const brandName = model.brand?.name ?? ""
    //             const label = [brandName, model.name].filter(Boolean).join(" ").trim() || model.name
    //             return {
    //                 id: model.id,
    //                 label
    //             }
    //         }),
    //     [vehicleModels]
    // )
    const vehicleModelOptions = useMemo(
        () =>
            vehicleModels.map((model) => {
                const label = [model.name]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || model.name

                return {
                    id: model.id,
                    label
                }
            }),
        [vehicleModels]
    )

    // normalize list vehicle để chắc chắn có modelId
    const vehicles = useMemo<VehicleWithStatus[]>(() => {
        const items = (vehiclesPage?.items ?? []) as VehicleWithStatus[]
        return items.map((vehicle) => ({
            ...vehicle,
            modelId: vehicle.modelId ?? vehicle.model?.id
        }))
    }, [vehiclesPage])

    const totalPages = vehiclesPage?.totalPages ?? 1
    const currentPage =
        vehiclesPage?.pageNumber ?? pagination.pageNumber ?? 1
    // Validation schemas
    const filterValidationSchema = useMemo(() => {
        return Yup.object({
            licensePlate: Yup.string().trim(),
            stationId: Yup.string().trim().nullable(),
            status: Yup.string()
                .nullable()
                .oneOf(
                    VEHICLE_STATUS_VALUES.map((s) => s.toString()).concat([
                        null as any
                    ])
                )
        })
    }, [])

    const createValidationSchema = useMemo(() => {
        const requiredMsg = translateWithFallback(
            t,
            "validation.required",
            "Required"
        )

        return Yup.object({
            licensePlate: Yup.string().trim().required(requiredMsg),
            stationId: Yup.string().trim().required(requiredMsg),
            modelId: Yup.string().trim().required(requiredMsg)
        })
    }, [t])

    const editValidationSchema = useMemo(() => {
        const requiredMsg = translateWithFallback(
            t,
            "validation.required",
            "Required"
        )

        return Yup.object({
            licensePlate: Yup.string().trim().required(requiredMsg),
            stationId: Yup.string().trim().required(requiredMsg),
            modelId: Yup.string().trim().required(requiredMsg),
            status: Yup.string()
                .nullable()
                .oneOf(
                    VEHICLE_STATUS_VALUES.map((s) => s.toString()).concat([
                        null as any
                    ])
                )
        })
    }, [t])

    // Formiks
    // Filter
    const handleSubmitFilter = useCallback(
        (values: VehicleFilterFormValues) => {
            const nextFilter: GetVehicleParams = {}

            const plate = values.licensePlate.trim()
            if (plate) nextFilter.licensePlate = plate

            if (values.stationId) {
                nextFilter.stationId = values.stationId
            }

            if (values.status) {
                nextFilter.status = Number(values.status) as VehicleStatus
            }

            setFilter(nextFilter)

            // reset về page 1
            setPagination((prev) => ({
                ...prev,
                pageNumber: 1
            }))
        },
        []
    )

    const filterFormik = useFormik<VehicleFilterFormValues>({
        initialValues: {
            licensePlate: "",
            stationId: null,
            status: null
        },
        validationSchema: filterValidationSchema,
        onSubmit: handleSubmitFilter
    })

    // create form
    const createVehicleMutation = useCreateVehicle()
    const createFormik = useFormik<CreateVehicleReq>({
        initialValues: {
            licensePlate: "",
            modelId: "",
            stationId: ""
        },
        validationSchema: createValidationSchema,
        onSubmit: (values, helpers) => {
            const payload: CreateVehicleReq = {
                licensePlate: values.licensePlate.trim(),
                modelId: values.modelId.trim(),
                stationId: values.stationId
            }

            createVehicleMutation.mutate(payload, {
                onSuccess: () => {
                    helpers.resetForm()
                    onCreateClose()
                }
            })
        }
    })

    // edit form
    const updateVehicleMutation = useUpdateVehicle()
    const editFormik = useFormik<VehicleEditFormValues>({
        enableReinitialize: true,
        initialValues: {
            licensePlate: editingVehicle?.licensePlate ?? "",
            stationId: editingVehicle?.stationId ?? "",
            modelId:
                editingVehicle?.model?.id ??
                editingVehicle?.modelId ??
                "",
            status:
                editingVehicle?.status != null
                    ? editingVehicle.status.toString()
                    : null
        },
        validationSchema: editValidationSchema,
        onSubmit: (values, helpers) => {
            if (!editingVehicle) return

            const payload: UpdateVehicleReq = {}

            const trimmedPlate = values.licensePlate.trim()
            if (
                trimmedPlate &&
                trimmedPlate !== editingVehicle.licensePlate
            ) {
                payload.licensePlate = trimmedPlate
            }

            if (
                values.stationId &&
                values.stationId !== editingVehicle.stationId
            ) {
                payload.stationId = values.stationId
            }

            if (
                values.modelId &&
                values.modelId !== editingVehicle.model?.id
            ) {
                payload.modelId = values.modelId
            }

            const hasStatusSelection =
                values.status !== null && values.status !== ""
            if (hasStatusSelection) {
                const statusValue = Number(values.status) as VehicleStatus
                if (editingVehicle.status !== statusValue) {
                    payload.status = statusValue
                }
            }

            // nếu không có thay đổi -> đóng luôn
            if (Object.keys(payload).length === 0) {
                helpers.resetForm()
                onEditClose()
                setEditingVehicle(null)
                return
            }

            updateVehicleMutation.mutate(
                {
                    vehicleId: editingVehicle.id,
                    payload
                },
                {
                    onSuccess: () => {
                        helpers.resetForm()
                        setEditingVehicle(null)
                        onEditClose()
                    }
                }
            )
        }
    })

    // Delete vehicle

    const deleteVehicleMutation = useDeleteVehicle()

    const handleConfirmDelete = useCallback(() => {
        if (!deletingVehicle) return

        deleteVehicleMutation.mutate(deletingVehicle.id, {
            onSuccess: () => {
                setDeletingVehicle(null)
                onDeleteClose()
            }
        })
    }, [deleteVehicleMutation, deletingVehicle, onDeleteClose])

    // Handlers (UI events)

    // filter dropdown station
    const handleStationFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                filterFormik.setFieldValue("stationId", null)
                return
            }

            const [value] = Array.from(keys)
            filterFormik.setFieldValue(
                "stationId",
                value != null ? value.toString() : null
            )
        },
        [filterFormik]
    )

    // filter dropdown status
    const handleStatusFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                filterFormik.setFieldValue("status", null)
                return
            }

            const [value] = Array.from(keys)
            filterFormik.setFieldValue(
                "status",
                value != null ? value.toString() : null
            )
        },
        [filterFormik]
    )

    // open edit modal
    const handleOpenEditVehicle = useCallback(
        (vehicle: VehicleWithStatus) => {
            setEditingVehicle(vehicle)
            onEditOpen()
        },
        [onEditOpen]
    )

    // close edit modal
    const handleCloseEditVehicle = useCallback(() => {
        editFormik.resetForm()
        setEditingVehicle(null)
        onEditClose()
    }, [editFormik, onEditClose])

    // open delete modal
    const handleOpenDeleteVehicle = useCallback(
        (vehicle: VehicleWithStatus) => {
            setDeletingVehicle(vehicle)
            onDeleteOpen()
        },
        [onDeleteOpen]
    )

    // close delete modal
    const handleCloseDeleteVehicle = useCallback(() => {
        setDeletingVehicle(null)
        onDeleteClose()
    }, [onDeleteClose])

    // close create modal
    const handleCloseCreateVehicle = useCallback(() => {
        createFormik.resetForm()
        onCreateClose()
    }, [createFormik, onCreateClose])
    // Render
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm space-y-6 mb-12">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">
                    {t("admin.vehicle_management_title")}
                </h1>
            </header>

            {/* Filter card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <form
                    onSubmit={filterFormik.handleSubmit}
                    className="space-y-5"
                >
                    <div className="flex items-center gap-2 text-slate-800">
                        <FunnelSimple
                            size={22}
                            className="text-primary"
                        />
                        <h3 className="text-lg font-semibold">
                            {t("admin.vehicle_filter_title")}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                        {/* license plate */}
                        <InputStyled
                            label={t("vehicle.license_plate")}
                            placeholder={t(
                                "vehicle.license_plate_placeholder"
                            )}
                            value={
                                filterFormik.values.licensePlate
                            }
                            onChange={(event) =>
                                filterFormik.setFieldValue(
                                    "licensePlate",
                                    event.target.value
                                )
                            }
                            onClear={() =>
                                filterFormik.setFieldValue(
                                    "licensePlate",
                                    ""
                                )
                            }
                            isClearable
                        />

                        {/* station */}
                        <FilterTypeStyle
                            label={t("vehicle.station_name")}
                            placeholder={t(
                                "vehicle.station_placeholder"
                            )}
                            selectedKeys={
                                filterFormik.values.stationId
                                    ? new Set([
                                          filterFormik
                                              .values
                                              .stationId
                                      ])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={
                                handleStationFilterChange
                            }
                        >
                            {stationOptions.map((option) => (
                                <FilterTypeOption
                                    key={option.key}
                                >
                                    {option.label}
                                </FilterTypeOption>
                            ))}
                        </FilterTypeStyle>

                        {/* status */}
                        <FilterTypeStyle
                            label={t("vehicle.status_label")}
                            placeholder={t(
                                "vehicle.status_placeholder"
                            )}
                            selectedKeys={
                                filterFormik.values.status
                                    ? new Set([
                                          filterFormik
                                              .values.status
                                      ])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={
                                handleStatusFilterChange
                            }
                        >
                            {statusOptions.map((option) => (
                                <FilterTypeOption
                                    key={option.key}
                                >
                                    {option.label}
                                </FilterTypeOption>
                            ))}
                        </FilterTypeStyle>

                        {/* actions */}
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                            <ButtonIconStyled
                                type="submit"
                                isDisabled={isFetchingVehicles}
                                aria-label={t("common.search")}
                                className="btn-gradient rounded-lg"
                            >
                                <SearchIcon />
                            </ButtonIconStyled>

                            <ButtonIconStyled
                                type="button"
                                onPress={onCreateOpen}
                                aria-label={t(
                                    "admin.vehicle_new_button"
                                )}
                                className="btn-gradient rounded-lg"
                            >
                                <Plus />
                            </ButtonIconStyled>
                        </div>
                    </div>
                </form>
            </div>

            {/* table */}
            <TableVehicleManagement
                vehicles={vehicles}
                stationNameById={stationNameById}
                vehicleModelsById={vehicleModelsById}
                isLoading={isFetchingVehicles}
                isModelsLoading={isFetchingVehicleModels}
                onEdit={handleOpenEditVehicle}
                onDelete={handleOpenDeleteVehicle}
            />

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-2">
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

            {/* create modal */}
            <VehicleCreateModal
                isOpen={isCreateOpen}
                onOpenChange={onCreateOpenChange}
                onClose={handleCloseCreateVehicle}
                stationOptions={stationSelectOptions}
                vehicleModelOptions={vehicleModelOptions}
                isModelLoading={isFetchingVehicleModels}
                formik={createFormik}
                isSubmitting={
                    createVehicleMutation.isPending
                }
            />

            {/* edit modal */}
            <VehicleEditModal
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                onClose={handleCloseEditVehicle}
                stationOptions={stationSelectOptions}
                statusOptions={statusOptions}
                vehicleModelOptions={vehicleModelOptions}
                isModelLoading={isFetchingVehicleModels}
                formik={editFormik}
                isSubmitting={
                    updateVehicleMutation.isPending
                }
            />

            {/* delete modal */}
            <ModalStyled
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                className="max-w-md"
            >
                <ModalContentStyled>
                    <ModalHeaderStyled>
                        {t(
                            "admin.vehicle_delete_title"
                        )}
                    </ModalHeaderStyled>

                    <ModalBodyStyled>
                        <p className="text-sm text-slate-600">
                            {t(
                                "admin.vehicle_delete_confirm"
                            )}
                        </p>

                        <div className="rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
                            <p>
                                <span className="font-semibold">
                                    {t(
                                        "vehicle.license_plate"
                                    )}
                                    :
                                </span>{" "}
                                {deletingVehicle
                                    ?.licensePlate ??
                                    "-"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    {t(
                                        "vehicle.station_name"
                                    )}
                                    :
                                </span>{" "}
                                {deletingVehicle
                                    ? stationNameById[
                                          deletingVehicle.stationId
                                      ] ??
                                      deletingVehicle.stationId
                                    : "-"}
                            </p>
                        </div>
                    </ModalBodyStyled>

                    <ModalFooterStyled className="gap-3">
                        <ButtonStyled
                            type="button"
                            color="secondary"
                            onPress={
                                handleCloseDeleteVehicle
                            }
                            className="bg-slate-200 text-slate-700"
                        >
                            {t("common.cancel")}
                        </ButtonStyled>

                        <ButtonStyled
                            type="button"
                            color="danger"
                            onPress={handleConfirmDelete}
                            isDisabled={
                                deleteVehicleMutation.isPending
                            }
                            className="bg-rose-500 text-white"
                        >
                            {t("common.delete")}
                        </ButtonStyled>
                    </ModalFooterStyled>
                </ModalContentStyled>
            </ModalStyled>
        </div>
    )
}
