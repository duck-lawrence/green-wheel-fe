import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"
import {
    CustomerAnonymousRes,
    CustomerRes,
    RevenueByYearRes,
    TotalRevenueRes,
    TotalStatisticRes,
    VehicleModelStatisticRes,
    VehicleTotalRes
} from "../models/statistic/schema/response"

export const statisticApi = {
    getCustomerStatistic: (query: { stationId: string }) => {
        return requestWrapper<CustomerRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/customers", { params })
            console.log("params", params)
            return res.data
        })
    },

    getAnonymousStatistic: (query: { stationId: string }) =>
        requestWrapper<CustomerAnonymousRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/customers/anonymous", { params })
            return res.data
        }),

    getTotalRevenueStatistic: (query: { stationId: string }) =>
        requestWrapper<TotalRevenueRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/revenue", { params })
            return res.data
        }),

    getTotalInvoiceStatistic: (query: { stationId: string }) =>
        requestWrapper<TotalStatisticRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/invoices", { params })
            return res.data
        }),

    getVehicleStatistic: (query: { stationId: string }) =>
        requestWrapper<VehicleTotalRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/vehicles", { params })
            return res.data
        }),

    getVehicleModelStatistic: (query: { stationId: string }) =>
        requestWrapper<VehicleModelStatisticRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/vehicle-models", { params })
            return res.data
        }),

    getRevenueByYear: (query: { stationId: string }) =>
        requestWrapper<RevenueByYearRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/revenue-by-year", { params })
            return res.data
        })
}
