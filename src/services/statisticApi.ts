import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"
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
    getCustomerStatistic: () =>
        requestWrapper<CustomerRes>(async () => {
            const res = await axiosInstance.get("/statistic/customers")
            return res.data
        }),

    getAnonymousStatistic: () =>
        requestWrapper<CustomerAnonymousRes>(async () => {
            const res = await axiosInstance.get("/statistic/customers/anonymous")
            return res.data
        }),
    getTotalRevenueStatistic: () =>
        requestWrapper<TotalRevenueRes>(async () => {
            const res = await axiosInstance.get("/statistic/revenue")
            return res.data
        }),
    getTotalInvoiceStatistic: () =>
        requestWrapper<TotalStatisticRes>(async () => {
            const res = await axiosInstance.get("/statistic/invoices")
            return res.data
        }),

    getVehicleStatistic: () =>
        requestWrapper<VehicleTotalRes>(async () => {
            const res = await axiosInstance.get("/statistic/vehicles")
            return res.data
        }),

    getVehicleModelStatistic: () =>
        requestWrapper<VehicleModelStatisticRes[]>(async () => {
            const res = await axiosInstance.get("/statistic/vehicle-models")
            return res.data
        }),
    getRevenueByYear: () =>
        requestWrapper<RevenueByYearRes[]>(async () => {
            const res = await axiosInstance.get("/statistic/revenue-by-year")
            return res.data
        })
}
