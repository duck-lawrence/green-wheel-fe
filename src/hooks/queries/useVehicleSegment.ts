import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { VehicleSegmentReq } from "@/models/vehicle/schema/request"
import { vehicleSegmentApi } from "@/services/vehicleSegmentApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useGetAllVehicleSegments = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const query = useQuery({
        queryKey: QUERY_KEYS.VEHICLE_SEGMENTS,
        queryFn: vehicleSegmentApi.getAll,
        enabled
    })
    return query
}

export const useGetVehicleSegmentById = ({
    id,
    enabled = true
}: {
    id: string
    enabled?: boolean
}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS, id],
        queryFn: () => vehicleSegmentApi.getById(id),
        enabled
    })
    return query
}

export const useCreateVehicleSegment = () => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: vehicleSegmentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS] })
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useUpdateVehicleSegment = () => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, req }: { id: string; req: VehicleSegmentReq }) =>
            await vehicleSegmentApi.update(id, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS] })
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useDeleteVehicleSegment = () => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await vehicleSegmentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS] })
            addToast({
                title: t("toast.success"),
                description: t("toast.delete_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
