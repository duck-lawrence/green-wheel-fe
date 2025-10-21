"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Selection } from "@heroui/react"
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react"
import {
    ButtonStyled,
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
import { VehicleModelViewRes, VehicleViewRes } from "@/models/vehicle/schema/response"
import {
    useCreateVehicle,
    useDeleteVehicle,
    useGetAllStations,
    useGetAllVehicleModels,
    useGetAllVehicles,
    useUpdateVehicle
} from "@/hooks"
import { VehicleCreateModal, VehicleEditModal } from "@/components/modals/VehicleModals"
import {
    CreateVehicleReq,
    GetVehicleParams,
    UpdateVehicleReq
} from "@/models/vehicle/schema/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
type VehicleWithStatus = VehicleViewRes & { status?: VehicleStatus; modelId?: string }
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
const PAGE_SIZE = 10
const VEHICLE_STATUS_VALUES = Object.values(VehicleStatus).filter(
    (value): value is VehicleStatus => typeof value === "number"
)
export default function AdminVehicleManagementPage() {
    const { t } = useTranslation()
    const [filters, setFilters] = useState<GetVehicleParams>({})
    const [page, setPage] = useState(1)
    const [vehicleToEdit, setVehicleToEdit] = useState<VehicleWithStatus | null>(null)
    const [vehicleToDelete, setVehicleToDelete] = useState<VehicleWithStatus | null>(null)
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
    const { data: stations = [] } = useGetAllStations({ enabled: true })
    const stationOptions = useMemo(
        () =>
            stations.map((station) => ({
                key: station.id,
                label: station.name
            })),
        [stations]
    )
    const stationSelectOptions = useMemo(
        () => stationOptions.map((option) => ({ id: option.key, label: option.label })),
        [stationOptions]
    )
    const stationNameById = useMemo(() => {
        return stations.reduce<Record<string, string>>((acc, station) => {
            acc[station.id] = station.name
            return acc
        }, {})
    }, [stations])
    const statusOptions = useMemo(
        () =>
            VEHICLE_STATUS_VALUES.map((status) => {
                const statusKey = VehicleStatus[status]?.toString().toLowerCase() ?? "unknown"
                return {
                    key: status.toString(),
                    label: translateWithFallback(t, `vehicle.status_value_${statusKey}`)
                }
            }),
        [t]
    )
    const { data: vehiclesData = [], isFetching: isFetchingVehicles } = useGetAllVehicles({
        params: filters,
        enabled: true
    })
    const vehicles = useMemo<VehicleWithStatus[]>(() => {
        return (vehiclesData as VehicleWithStatus[]).map((vehicle) => ({
            ...vehicle,
            modelId: vehicle.modelId ?? vehicle.model?.id
        }))
    }, [vehiclesData])
    const { data: vehicleModels = [], isFetching: isFetchingVehicleModels } =
        useGetAllVehicleModels()
    const vehicleModelsById = useMemo(() => {
        return vehicleModels.reduce<Record<string, VehicleModelViewRes>>((acc, model) => {
            acc[model.id] = model
            return acc
        }, {})
    }, [vehicleModels])
    const vehicleModelOptions = useMemo(
        () =>
            vehicleModels.map((model) => {
                const brandName = model.brand?.name ?? ""
                const label = [brandName, model.name].filter(Boolean).join(" ").trim() || model.name
                return {
                    id: model.id,
                    label
                }
            }),
        [vehicleModels]
    )
    //     () =>
    //             id: model.id,
    //             label: [model.brand?.name, model.name].filter(Boolean).join(" ") || model.name
    //         })),
    // )
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((vehicle) => {
            if (filters.licensePlate) {
                const plate = filters.licensePlate.toLowerCase()
                if (!vehicle.licensePlate.toLowerCase().includes(plate)) {
                    return false
                }
            }
            if (filters.stationId && vehicle.stationId !== filters.stationId) {
                return false
            }
            if (filters.status != null && vehicle.status !== filters.status) {
                return false
            }
            return true
        })
    }, [filters, vehicles])
    const totalItems = filteredVehicles.length
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const paginatedVehicles = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE
        return filteredVehicles.slice(start, start + PAGE_SIZE)
    }, [currentPage, filteredVehicles])
    useEffect(() => {
        setPage(1)
    }, [filters])
    useEffect(() => {
        if (page !== currentPage) {
            setPage(currentPage)
        }
    }, [currentPage, page])
    const filterValidationSchema = useMemo(() => {
        return Yup.object({
            licensePlate: Yup.string().trim(),
            stationId: Yup.string().trim().nullable(),
            status: Yup.string()
                .nullable()
                .oneOf(
                    VEHICLE_STATUS_VALUES.map((status) => status.toString()).concat([null as any])
                )
        })
    }, [])
    const handleFilterSubmit = useCallback((values: VehicleFilterFormValues) => {
        const nextFilters: GetVehicleParams = {}
        const licensePlate = values.licensePlate.trim()
        if (licensePlate) {
            nextFilters.licensePlate = licensePlate
        }
        if (values.stationId) {
            nextFilters.stationId = values.stationId
        }
        if (values.status) {
            nextFilters.status = Number(values.status) as VehicleStatus
        }
        setFilters(nextFilters)
    }, [])
    const filterFormik = useFormik<VehicleFilterFormValues>({
        initialValues: {
            licensePlate: "",
            stationId: null,
            status: null
        },
        validationSchema: filterValidationSchema,
        onSubmit: handleFilterSubmit
    })
    const handleStationFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                filterFormik.setFieldValue("stationId", null)
                return
            }
            const [value] = Array.from(keys)
            filterFormik.setFieldValue("stationId", value != null ? value.toString() : null)
        },
        [filterFormik]
    )
    const handleStatusFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                filterFormik.setFieldValue("status", null)
                return
            }
            const [value] = Array.from(keys)
            filterFormik.setFieldValue("status", value != null ? value.toString() : null)
        },
        [filterFormik]
    )
    const createVehicleMutation = useCreateVehicle()
    const updateVehicleMutation = useUpdateVehicle()
    const deleteVehicleMutation = useDeleteVehicle()
    const createValidationSchema = useMemo(() => {
        const requiredMsg = t("validation.required")
        return Yup.object({
            licensePlate: Yup.string().trim().required(requiredMsg),
            stationId: Yup.string().trim().required(requiredMsg),
            modelId: Yup.string().trim().required(requiredMsg)
        })
    }, [t])
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
    const editValidationSchema = useMemo(() => {
        const requiredMsg = t("validation.required")
        return Yup.object({
            licensePlate: Yup.string().trim().required(requiredMsg),
            stationId: Yup.string().trim().required(requiredMsg),
            modelId: Yup.string().trim().required(requiredMsg),
            status: Yup.string()
                .nullable()
                .oneOf(
                    VEHICLE_STATUS_VALUES.map((status) => status.toString()).concat([null as any])
                )
        })
    }, [t])
    const editFormik = useFormik<VehicleEditFormValues>({
        enableReinitialize: true,
        initialValues: {
            licensePlate: vehicleToEdit?.licensePlate ?? "",
            stationId: vehicleToEdit?.stationId ?? "",
            modelId: vehicleToEdit?.model?.id ?? vehicleToEdit?.modelId ?? "",
            status: vehicleToEdit?.status != null ? vehicleToEdit.status.toString() : null
        },
        validationSchema: editValidationSchema,
        onSubmit: (values, helpers) => {
            if (!vehicleToEdit) return
            const payload: UpdateVehicleReq = {}
            const trimmedPlate = values.licensePlate.trim()
            if (trimmedPlate && trimmedPlate !== vehicleToEdit.licensePlate) {
                payload.licensePlate = trimmedPlate
            }
            if (values.stationId && values.stationId !== vehicleToEdit.stationId) {
                payload.stationId = values.stationId
            }
            if (values.modelId && values.modelId !== vehicleToEdit.model?.id) {
                payload.modelId = values.modelId
            }
            const hasStatusSelection = values.status !== null && values.status !== ""
            if (hasStatusSelection) {
                const statusValue = Number(values.status) as VehicleStatus
                if (vehicleToEdit.status !== statusValue) {
                    payload.status = statusValue
                }
            }
            if (Object.keys(payload).length === 0) {
                helpers.resetForm()
                onEditClose()
                return
            }
            updateVehicleMutation.mutate(
                {
                    vehicleId: vehicleToEdit.id,
                    payload
                },
                {
                    onSuccess: () => {
                        helpers.resetForm()
                        setVehicleToEdit(null)
                        onEditClose()
                    }
                }
            )
        }
    })
    const handleOpenEditVehicle = useCallback(
        (vehicle: VehicleWithStatus) => {
            setVehicleToEdit(vehicle)
            onEditOpen()
        },
        [onEditOpen]
    )
    const handleOpenDeleteVehicle = useCallback(
        (vehicle: VehicleWithStatus) => {
            setVehicleToDelete(vehicle)
            onDeleteOpen()
        },
        [onDeleteOpen]
    )
    const handleCloseCreate = useCallback(() => {
        createFormik.resetForm()
        onCreateClose()
    }, [createFormik, onCreateClose])
    const handleCloseEdit = useCallback(() => {
        editFormik.resetForm()
        setVehicleToEdit(null)
        onEditClose()
    }, [editFormik, onEditClose])
    const handleCloseDelete = useCallback(() => {
        setVehicleToDelete(null)
        onDeleteClose()
    }, [onDeleteClose])
    const handleConfirmDelete = useCallback(() => {
        if (!vehicleToDelete) return
        deleteVehicleMutation.mutate(vehicleToDelete.id, {
            onSuccess: () => {
                setVehicleToDelete(null)
                onDeleteClose()
            }
        })
    }, [deleteVehicleMutation, onDeleteClose, vehicleToDelete])
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">
                    {t("admin.vehicle_management_title")}
                </h1>
            </header>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <form onSubmit={filterFormik.handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-2 text-slate-800">
                        <FunnelSimple size={22} className="text-primary" />
                        <h3 className="text-lg font-semibold">{t("admin.vehicle_filter_title")}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                        <InputStyled
                            label={t("vehicle.license_plate")}
                            placeholder={t("vehicle.license_plate_placeholder")}
                            value={filterFormik.values.licensePlate}
                            onChange={(event) =>
                                filterFormik.setFieldValue("licensePlate", event.target.value)
                            }
                            onClear={() => filterFormik.setFieldValue("licensePlate", "")}
                            isClearable
                        />
                        <FilterTypeStyle
                            label={t("vehicle.station_name")}
                            placeholder={t("vehicle.station_placeholder")}
                            selectedKeys={
                                filterFormik.values.stationId
                                    ? new Set([filterFormik.values.stationId])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={handleStationFilterChange}
                        >
                            {stationOptions.map((option) => (
                                <FilterTypeOption key={option.key}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                        <FilterTypeStyle
                            label={t("vehicle.status_label")}
                            placeholder={t("vehicle.status_placeholder")}
                            selectedKeys={
                                filterFormik.values.status
                                    ? new Set([filterFormik.values.status])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={handleStatusFilterChange}
                        >
                            {statusOptions.map((option) => (
                                <FilterTypeOption key={option.key}>{option.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                            <ButtonStyled
                                type="submit"
                                isDisabled={isFetchingVehicles}
                                aria-label={t("common.search")}
                                className="flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-white sm:h-10 sm:w-16 sm:px-0"
                            >
                                <MagnifyingGlass size={18} weight="bold" aria-hidden />
                                <span className="sr-only">{t("common.search")}</span>
                            </ButtonStyled>
                            <ButtonStyled
                                type="button"
                                onPress={onCreateOpen}
                                className="h-10 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-white sm:h-10 sm:w-20 sm:px-0"
                            >
                                {t("admin.vehicle_new_button")}
                            </ButtonStyled>
                        </div>
                    </div>
                </form>
            </div>
            <TableVehicleManagement
                vehicles={paginatedVehicles}
                stationNameById={stationNameById}
                vehicleModelsById={vehicleModelsById}
                isLoading={isFetchingVehicles}
                isModelsLoading={isFetchingVehicleModels}
                onEdit={handleOpenEditVehicle}
                onDelete={handleOpenDeleteVehicle}
            />
            {totalItems > PAGE_SIZE ? (
                <div className="flex justify-center pt-2">
                    <PaginationStyled
                        pageNumber={currentPage}
                        pageSize={PAGE_SIZE}
                        totalItems={totalItems}
                        onPageChange={setPage}
                        showControls
                    />
                </div>
            ) : null}
            <VehicleCreateModal
                isOpen={isCreateOpen}
                onOpenChange={onCreateOpenChange}
                onClose={handleCloseCreate}
                stationOptions={stationSelectOptions}
                vehicleModelOptions={vehicleModelOptions}
                isModelLoading={isFetchingVehicleModels}
                formik={createFormik}
                isSubmitting={createVehicleMutation.isPending}
            />
            <VehicleEditModal
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                onClose={handleCloseEdit}
                stationOptions={stationSelectOptions}
                statusOptions={statusOptions}
                vehicleModelOptions={vehicleModelOptions}
                isModelLoading={isFetchingVehicleModels}
                formik={editFormik}
                isSubmitting={updateVehicleMutation.isPending}
            />
            <ModalStyled
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                className="max-w-md"
            >
                <ModalContentStyled>
                    <ModalHeaderStyled>{t("admin.vehicle_delete_title")}</ModalHeaderStyled>
                    <ModalBodyStyled>
                        <p className="text-sm text-slate-600">
                            {t("admin.vehicle_delete_confirm")}
                        </p>
                        <div className="rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
                            <p>
                                <span className="font-semibold">{t("vehicle.license_plate")}:</span>{" "}
                                {vehicleToDelete?.licensePlate ?? "-"}
                            </p>
                            <p>
                                <span className="font-semibold">{t("vehicle.station_name")}:</span>{" "}
                                {vehicleToDelete
                                    ? stationNameById[vehicleToDelete.stationId] ??
                                      vehicleToDelete.stationId
                                    : "-"}
                            </p>
                        </div>
                    </ModalBodyStyled>
                    <ModalFooterStyled className="gap-3">
                        <ButtonStyled
                            type="button"
                            color="secondary"
                            onPress={handleCloseDelete}
                            className="bg-slate-200 text-slate-700"
                        >
                            {t("common.cancel")}
                        </ButtonStyled>
                        <ButtonStyled
                            type="button"
                            color="danger"
                            onPress={handleConfirmDelete}
                            isDisabled={deleteVehicleMutation.isPending}
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
