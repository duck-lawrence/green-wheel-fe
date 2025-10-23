import { QUERY_KEYS } from "@/constants/queryKey"
import { VehicleFilterReq } from "@/models/vehicle/schema/request"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { vehicleModelApi } from "@/services/vehicleModelApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllVehicleModels = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_MODELS, "all"],
        queryFn: vehicleModelApi.getAll,
        enabled
    })
}

export const useSearchVehicleModels = ({
    query,
    enabled = true
}: {
    query: VehicleFilterReq
    enabled?: boolean
}) => {
    const key = [QUERY_KEYS.VEHICLE_MODELS, query]

    return useQuery({
        queryKey: key,
        queryFn: async () => await vehicleModelApi.search(query),
        enabled
    })

    // const getCachedOrFetch = async () => {
    //     const cached = queryClient.getQueryData<VehicleModelViewRes[]>(key)
    //     if (cached) return cached
    //     const data = await queryClient.fetchQuery({
    //         queryKey: key,
    //         queryFn: () => vehicleModelApi.search(query)
    //     })
    //     return data
    // }

    // return {
    //     ...queryResult,
    //     getCachedOrFetch
    // }
}

export const useGetVehicleModelById = ({
    modelId,
    query,
    enabled = true
}: {
    modelId: string
    query: VehicleFilterReq
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
