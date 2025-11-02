import { BrandViewRes } from "@/models/brand/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"


export const brandApi = {
    getAll: () =>
        requestWrapper<BrandViewRes[]>(async () => {
            const res = await axiosInstance.get("/brands")
            return res.data
        })
}
