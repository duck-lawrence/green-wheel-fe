import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/queryKey"
import { PaginationParams } from "@/models/common/request"
import { BackendError, PageResult } from "@/models/common/response"
import {
  CreateVehicleComponentReq,
  GetVehicleComponentsParams,
  UpdateVehicleComponentReq
} from "@/models/component/request"
import {
  CreateVehicleComponentRes,
  VehicleComponentViewRes
} from "@/models/component/response"
import { vehicleComponentApi } from "@/services/vehicleComponentApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useGetVehicleComponents = ({
  params = {},
  pagination,
  enabled = true
}: {
  params?: GetVehicleComponentsParams
  pagination?: PaginationParams
  enabled?: boolean
}) => {
  const queryClient = useQueryClient()

  const queryKey = [...QUERY_KEYS.VEHICLE_COMPONENTS, params ?? {}, pagination ?? null]
  const cached = queryClient.getQueryData<PageResult<VehicleComponentViewRes>>(queryKey)

  return useQuery({
    queryKey,
    queryFn: () => vehicleComponentApi.getAll({ query: params, pagination }),
    initialData: cached,
    placeholderData: (prev) => prev,
    enabled
  })
}

export const useGetVehicleComponentById = ({
  id,
  enabled = true
}: {
  id: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.VEHICLE_COMPONENTS, "detail", id],
    queryFn: () => vehicleComponentApi.getById(id),
    enabled
  })
}

export const useCreateVehicleComponent = ({
  onSuccess
}: {
  onSuccess?: (res: CreateVehicleComponentRes) => void
} = {}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateVehicleComponentReq) =>
      vehicleComponentApi.create(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_COMPONENTS })
      toast.success(t("success.create"))
      onSuccess?.(response)
    },
    onError: (error: BackendError) => {
      toast.error(translateWithFallback(t, error.detail))
    }
  })
}

export const useUpdateVehicleComponent = ({
  onSuccess
}: {
  onSuccess?: () => void
} = {}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVehicleComponentReq }) =>
      vehicleComponentApi.update({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_COMPONENTS })
      toast.success(t("success.update"))
      onSuccess?.()
    },
    onError: (error: BackendError) => {
      toast.error(translateWithFallback(t, error.detail))
    }
  })
}

export const useDeleteVehicleComponent = ({
  onSuccess
}: {
  onSuccess?: () => void
} = {}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => vehicleComponentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_COMPONENTS })
      toast.success(t("success.delete"))
      onSuccess?.()
    },
    onError: (error: BackendError) => {
      toast.error(translateWithFallback(t, error.detail))
    }
  })
}
