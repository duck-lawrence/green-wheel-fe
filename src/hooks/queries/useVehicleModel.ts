import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import {
    CreateVehicleModelReq,
    DeleteModelImagesReq,
    GetAllModelParams,
    SearchModelParams,
    UpdateVehicleModelReq
} from "@/models/vehicle/schema/request"
import {
    CreateVehicleModelRes,
    VehicleModelImagesRes,
    VehicleModelViewRes
} from "@/models/vehicle/schema/response"
import { vehicleModelApi } from "@/services/vehicleModelApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useGetAllVehicleModels = ({
    query,
    enabled = true
}: {
    query: GetAllModelParams
    enabled?: boolean
}) => {
    return useQuery({
        queryKey: QUERY_KEYS.VEHICLE_MODELS,
        queryFn: async () => {
            const data = await vehicleModelApi.getAll(query)
            return data
        },
        enabled
    })
}

export const useSearchVehicleModels = ({
    query,
    enabled = true
}: {
    query: SearchModelParams
    enabled?: boolean
}) => {
    const key = [QUERY_KEYS.VEHICLE_MODELS, query]
    const queryClient = useQueryClient()

    const queryResult = useQuery({
        queryKey: key,
        queryFn: async () => {
            const data = await vehicleModelApi.search(query)
            queryClient.setQueryData(key, data)
            return data
        },
        initialData: () => {
            return queryClient.getQueryData<VehicleModelViewRes[]>(key)
        },
        enabled
    })

    const getCachedOrFetch = async () => {
        const cached = queryClient.getQueryData<VehicleModelViewRes[]>(key)
        if (cached) return cached
        const data = await queryClient.fetchQuery({
            queryKey: key,
            queryFn: () => vehicleModelApi.search(query)
        })
        return data
    }

    return {
        ...queryResult,
        getCachedOrFetch
    }
}

export const useGetVehicleModelById = ({
    modelId,
    query,
    enabled = true
}: {
    modelId: string
    query: SearchModelParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_MODELS, modelId, query],
        queryFn: () => vehicleModelApi.getById({ modelId, query }),
        initialData: () => {
            const cachedList = queryClient.getQueryData<VehicleModelViewRes[]>([
                ...QUERY_KEYS.VEHICLE_MODELS,
                modelId,
                query
            ])
            return cachedList?.find((v) => v.id === modelId)
        },
        enabled
    })
}

export const useCreateVehicleModel = ({
    onSuccess,
    onError
}: {
    onSuccess?: (response: CreateVehicleModelRes) => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateVehicleModelReq) => vehicleModelApi.create(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            toast.success(t("success.create"))
            onSuccess?.(response)
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
            onError?.()
        }
    })
}

export const useUpdateVehicleModel = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateVehicleModelReq }) =>
            vehicleModelApi.update({ id, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            toast.success(t("success.update"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
            onError?.()
        }
    })
}

export const useUploadModelImages = ({
    id,
    onSuccess,
    onError
}: {
    id: string
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            await vehicleModelApi.uploadAllImages({ id, formData })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            onSuccess?.()
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUploadModelMainImage = ({
    id,
    onSuccess,
    onError
}: {
    id: string
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            await vehicleModelApi.uploadMainImage({ id, formData })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            onSuccess?.()
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUploadModelSubImages = ({
    id,
    onSuccess,
    onError
}: {
    id: string
    onSuccess?: (images: VehicleModelImagesRes[]) => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            return vehicleModelApi.uploadSubImages({ id, formData })
        },
        onSuccess: (images) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            onSuccess?.(images ?? [])
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useDeleteModelImages = ({
    id,
    onSuccess,
    onError
}: {
    id: string
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: DeleteModelImagesReq) =>
            vehicleModelApi.deleteSubImages({ id, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            onSuccess?.()
            toast.success(t("success.delete"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
