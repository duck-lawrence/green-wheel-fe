import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import {
    CreateVehicleModelReq,
    DeleteModelImagesReq,
    GetAllModelParams,
    SearchModelParams,
    UpdateModelComponentsReq,
    UpdateVehicleModelReq
} from "@/models/vehicle/schema/request"
import {
    CreateVehicleModelRes,
    VehicleModelImagesRes,
    VehicleModelViewRes
} from "@/models/vehicle/schema/response"
import { vehicleModelApi } from "@/services/vehicleModelApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const useGetAllVehicleModelImages = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_MODELS, "images"],
        queryFn: async () => {
            const data = await vehicleModelApi.getAllImages()
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

            addToast({
                title: t("toast.success"),
                description: t("success.create"),
                color: "success"
            })

            onSuccess?.(response)
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })

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

            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })

            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })

            onError?.()
        }
    })
}

export const useUpdateVehicleModelComponents = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateModelComponentsReq }) =>
            vehicleModelApi.updateComponents({ id, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            addToast({
                title: t("toast.success"),
                description: t("success.update"),
                color: "success"
            })
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
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
            addToast({
                title: t("toast.success"),
                description: t("success.delete"),
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

export const useDeleteVehicleModel = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => vehicleModelApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_MODELS })
            addToast({
                title: t("toast.success"),
                description: t("success.delete"),
                color: "success"
            })
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })

            onError?.()
        }
    })
}
