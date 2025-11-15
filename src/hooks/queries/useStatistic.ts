import { QUERY_KEYS } from "@/constants/queryKey"
import {
    BookingByYearRes,
    InvoiceByYearRes,
    RevenueByYearRes,
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
    const queryKey = [...QUERY_KEYS.STATISTICS, "customers", stationId]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getCustomerStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<TotalStatisticRes>(queryKey)
        },
        enabled
    })
}

export const useGetAnonymuousStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "anonymuous", stationId]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getAnonymousStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<TotalStatisticRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalRevenueStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "revenues", stationId]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getTotalRevenueStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<TotalStatisticRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalInvoiceStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, ...QUERY_KEYS.INVOICES, stationId]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getTotalInvoiceStatistic({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<TotalStatisticRes>(queryKey)
        },
        enabled
    })
}

export const useGetTotalContractsStatistic = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, ...QUERY_KEYS.RENTAL_CONTRACTS, stationId]
    return useQuery<TotalStatisticRes>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getTotalContractStatistic({ stationId: stationId || "" }),
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
    const queryKey = [...QUERY_KEYS.STATISTICS, "vehicles", stationId]
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
    const queryKey = [...QUERY_KEYS.STATISTICS, "vehicle-models", stationId]
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
    const queryKey = [...QUERY_KEYS.STATISTICS, "revenue-by-year", stationId]
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
    const queryKey = [...QUERY_KEYS.STATISTICS, "invoice-by-year", stationId]
    return useQuery<InvoiceByYearRes[]>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getInvoiceByYear({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<InvoiceByYearRes[]>(queryKey)
        },
        enabled
    })
}

export const useGetBookingByYear = ({
    stationId,
    enabled = true
}: { stationId?: string; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    const queryKey = [...QUERY_KEYS.STATISTICS, "booking-by-year", stationId]
    return useQuery<BookingByYearRes[]>({
        queryKey: queryKey,
        queryFn: () => statisticApi.getBookingByYear({ stationId: stationId || "" }),
        initialData: () => {
            return queryClient.getQueryData<BookingByYearRes[]>(queryKey)
        },
        enabled
    })
}
