import { QUERY_KEYS } from "@/constants/queryKey"
import {
    GetAllVehicleChecklistParams,
    UpdateChecklistItemReq,
    UpdateVehicleChecklistReq
} from "@/models/checklist/schema/request"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { PaginationParams } from "@/models/common/request"
import { BackendError, PageResult } from "@/models/common/response"
import { vehicleChecklistsApi } from "@/services/vehicleChecklistsApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export const useGetAllVehicleChecklists = ({
    query,
    pagination = {},
    enabled = true
}: {
    query: GetAllVehicleChecklistParams
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, query, pagination],
        queryFn: () => vehicleChecklistsApi.getAll({ query, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<VehicleChecklistViewRes>>([
                ...QUERY_KEYS.VEHICLE_CHECKLISTS,
                query,
                pagination
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
            addToast({
                title: t("toast.success"),
                description: `${t("success.create")}, ${t("common.redirecting").toLowerCase()}`,
                color: "success"
            })

            router.push(`/dashboard/vehicle-checklists/${id}`)
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
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

            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
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
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useSignByCustomer = ({
    id,
    onSuccess = undefined
}: {
    id: string
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            await vehicleChecklistsApi.signByCustomer({ id })
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({
                queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, id]
            })
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
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
            addToast({
                title: t("toast.success"),
                description: t("success.upload"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
