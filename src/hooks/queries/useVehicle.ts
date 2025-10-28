"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { PaginationParams } from "@/models/common/request"
import { GetVehicleParams, UpdateVehicleReq } from "@/models/vehicle/schema/request"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import { vehicleApi } from "@/services/vehicleApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

export const useGetAllVehicles = ({
    params = {},
    pagination = {},
    enabled = true,
}: {
    params?: GetVehicleParams
    pagination?: PaginationParams
    enabled?: boolean
} = {}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLES, params, pagination],
        queryFn: () => vehicleApi.getAll({ params, pagination }),
        initialData: () => {
            return queryClient.getQueryData([
                ...QUERY_KEYS.VEHICLES,
                params,
                pagination,
            ])
        },
        enabled,
    })
}

export const useGetVehicleById = ({
    vehicleId,
    enabled = true
}: {
    vehicleId: string
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLES, vehicleId],
        queryFn: () => vehicleApi.getById(vehicleId),
        initialData: () => {
            return queryClient
                .getQueryData<VehicleViewRes[]>(QUERY_KEYS.VEHICLES)
                ?.find((vehicle) => vehicle.id === vehicleId)
        },
        enabled
    })
}

export const useCreateVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: (vehicle: VehicleViewRes) => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: vehicleApi.create,
        onSuccess: (vehicle) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            toast.success(t("success.create"))
            onSuccess?.(vehicle)
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
            onError?.()
        }
    })
}

export const useUpdateVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: (vehicle: VehicleViewRes) => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: UpdateVehicleReq }) =>
            vehicleApi.update({ vehicleId, payload }),
        onSuccess: (vehicle) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            toast.success(t("success.update"))
            onSuccess?.(vehicle)
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
            onError?.()
        }
    })
}

export const useDeleteVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: vehicleApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            toast.success(t("success.delete"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
            onError?.()
        }
    })
}
