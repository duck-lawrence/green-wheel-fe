import { QUERY_KEYS } from "@/constants/queryKey"
import {
    GetAllVehicleChecklistParams,
    UpdateChecklistItemReq,
    UpdateVehicleChecklistReq
} from "@/models/checklist/schema/request"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { BackendError } from "@/models/common/response"
import { vehicleChecklistsApi } from "@/services/vehicleChecklistsApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useGetAllVehicleChecklists = ({
    query,
    enabled = true
}: {
    query: GetAllVehicleChecklistParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, query],
        queryFn: () => vehicleChecklistsApi.getAll(query),
        initialData: () => {
            return queryClient.getQueryData<VehicleChecklistViewRes[]>([
                ...QUERY_KEYS.VEHICLE_CHECKLISTS,
                query
            ])
        },
        enabled
    })
}

export const useGetVehicleChecklistById = ({
    id,
    enabled = true
}: {
    id: string
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, id],
        queryFn: () => vehicleChecklistsApi.getById(id),
        initialData: () => {
            return queryClient.getQueryData<VehicleChecklistViewRes>([
                ...QUERY_KEYS.VEHICLE_CHECKLISTS,
                id
            ])
        },
        refetchOnWindowFocus: false,
        enabled
    })
    return query
}

export const useCreateVehicleChecklist = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const router = useRouter()
    return useMutation({
        mutationFn: vehicleChecklistsApi.create,
        onSuccess: ({ id }) => {
            toast.success(t("success.create"))
            router.push(`/dashboard/vehicle-checklists/${id}`)
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateVehicleChecklist = ({
    id,
    onSuccess = undefined
}: {
    id: string
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (req: UpdateVehicleChecklistReq) => {
            await vehicleChecklistsApi.update({ id, req })
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({
                queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, id]
            })
            toast.success(t("success.update"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateVehicleChecklistItem = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const router = useRouter()

    return useMutation({
        mutationFn: async ({ id, req }: { id: string; req: UpdateChecklistItemReq }) => {
            await vehicleChecklistsApi.updateItem({ id, req })
        },
        onSuccess: () => {
            router.refresh()
            // toast.success(t("success.update"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUploadChecklistItemImage = ({
    itemId,
    onSuccess,
    onError
}: {
    itemId: string
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            return await vehicleChecklistsApi.uploadItemImage({ itemId, formData })
        },
        onSuccess: async () => {
            onSuccess?.()
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
