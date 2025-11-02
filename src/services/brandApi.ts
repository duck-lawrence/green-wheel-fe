import { BrandReq } from "@/models/brand/schema/request"
import { BrandViewRes } from "@/models/brand/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const brandApi = {
    getAll: () =>
        requestWrapper<BrandViewRes[]>(async () => {
            const res = await axiosInstance.get("/brands")
            return res.data
        }),

    getById: (id: string) =>
        requestWrapper<BrandViewRes>(async () => {
            const res = await axiosInstance.get(`/brands/${id}`)
            return res.data
        }),

    create: (req: BrandReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/brands", req)
        }),

    update: (id: string, req: BrandReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/brands/${id}`, req)
        }),

    delete: (id: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/brands/${id}`)
        })
}
