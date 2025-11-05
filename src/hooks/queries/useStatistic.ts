import { QUERY_KEYS } from "@/constants/queryKey"
import {
    CustomerAnonymousRes,
    CustomerRes,
    InvoiceByYearRes,
    RevenueByYearRes,
    TotalRevenueRes,
    TotalStatisticRes,
    VehicleModelStatisticRes,
    VehicleTotalRes
} from "@/models/statistic/schema/response"
import { statisticApi } from "@/services/statisticApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetCustomerStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "customers"]
    return useQuery<CustomerRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getCustomerStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<CustomerRes>(queryKey)
        },
        enabled
    })
}

export const useGetAnonymuousStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "anonymuous"]
    return useQuery<CustomerAnonymousRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getAnonymousStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<CustomerAnonymousRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalRevenueStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "revenues"]
    return useQuery<TotalRevenueRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getTotalRevenueStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<TotalRevenueRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalInvoiceStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "invoices"]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getTotalInvoiceStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<TotalStatisticRes>(queryKey)
        },
        enabled
    })
}

export const useGetVehicleStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "vehicles"]
    return useQuery<VehicleTotalRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getVehicleStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<VehicleTotalRes>(queryKey)
        },
        enabled
    })
}

export const useGetVehicleModelStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "vehicle-models"]
    return useQuery<VehicleModelStatisticRes[]>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getVehicleModelStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<VehicleModelStatisticRes[]>(queryKey)
        },
        enabled
    })
}

export const useGetRevenueByYear = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "revenue-by-year"]
    return useQuery<RevenueByYearRes[]>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getRevenueByYear({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<RevenueByYearRes[]>(queryKey)
        },
        enabled
    })
}

export const useGetInvoiceByYear = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "invoice-by-year"]
    return useQuery<InvoiceByYearRes[]>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getInvoiceByYear({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<InvoiceByYearRes[]>(queryKey)
        },
        enabled
    })
}
