import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"
import {
    CustomerAnonymusRes,
    CustomerRes,
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

    getAnonymuousStatistic: () =>
        requestWrapper<CustomerAnonymusRes>(async () => {
            const res = await axiosInstance.get("/statistic/customers/anonymuous")
            return res.data
        }),
    getTotalRevenueStatistic: () =>
        requestWrapper<TotalRevenueRes>(async () => {
            const res = await axiosInstance.get("/statistis/revenues")
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
        })
}
