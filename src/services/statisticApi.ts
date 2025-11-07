import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"
import {
    BookingByYearRes,
    CustomerAnonymousRes,
    CustomerRes,
    InvoiceByYearRes,
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
        }),

    getInvoiceByYear: (query: { stationId: string }) =>
        requestWrapper<InvoiceByYearRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/invoice-by-year", { params })
            return res.data
        }),

    getBookingByYear: (query: { stationId: string }) =>
        requestWrapper<BookingByYearRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/statistic/contract-by-year", { params })
            return res.data
        })
}
