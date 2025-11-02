import { QUERY_KEYS } from "@/constants/queryKey"
import {
    CustomerAnonymousRes,
    CustomerRes,
    TotalRevenueRes,
    TotalStatisticRes,
    VehicleModelStatisticRes,
    VehicleTotalRes
} from "@/models/statistic/schema/response"
import { statisticApi } from "@/services/statisticApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetCustomerStatistic = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "customers"]
    return useQuery<CustomerRes>({
        queryKey: queryKey,
        queryFn: statisticApi.getCustomerStatistic,
        initialData: () => {
            return queryClient.getQueryData<CustomerRes>(queryKey)
        },
        enabled
    })
}

export const useGetAnonymuousStatistic = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "anonymuous"]
    return useQuery<CustomerAnonymousRes>({
        queryKey: queryKey,
        queryFn: statisticApi.getAnonymousStatistic,
        initialData: () => {
            return queryClient.getQueryData<CustomerAnonymousRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalRevenueStatistic = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "revenues"]
    return useQuery<TotalRevenueRes>({
        queryKey: queryKey,
        queryFn: statisticApi.getTotalRevenueStatistic,
        initialData: () => {
            return queryClient.getQueryData<TotalRevenueRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalInvoiceStatistic = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "invoices"]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: statisticApi.getTotalInvoiceStatistic,
        initialData: () => {
            return queryClient.getQueryData<TotalStatisticRes>(queryKey)
        },
        enabled
    })
}

export const useGetVehicleStatistic = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "vehicles"]
    return useQuery<VehicleTotalRes>({
        queryKey: queryKey,
        queryFn: statisticApi.getVehicleStatistic,
        initialData: () => {
            return queryClient.getQueryData<VehicleTotalRes>(queryKey)
        },
        enabled
    })
}

export const useGetVehicleModelStatistic = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "vehicle-models"]
    return useQuery<VehicleModelStatisticRes[]>({
        queryKey: queryKey,
        queryFn: statisticApi.getVehicleModelStatistic,
        initialData: () => {
            return queryClient.getQueryData<VehicleModelStatisticRes[]>(queryKey)
        },
        enabled
    })
}
