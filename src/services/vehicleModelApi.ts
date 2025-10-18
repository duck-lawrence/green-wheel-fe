import { VehicleFilterReq } from "@/models/vehicle/schema/request"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const vehicleModelApi = {
    //Không thể dùng useGetVehicleModelById cho toàn bộ danh sách vì hook React phải được gọi với số lượng cố định mỗi lần render
    //Vehicle thay đổi thì số lượng gọi model qua id cũng thay đổi (Mà có nhiều vehicle nếu gọi từng model id dễ gây lỗi và mất dữ liệu)
    //  → gọi hook trong vòng lặp gây crash hoặc vi phạm Rules of Hooks. 
    // Nên t thêm getAll các ID và fetch tập trung.
    getAll: () =>
        requestWrapper<VehicleModelViewRes[]>(async () => {
            const res = await axiosInstance.get("/vehicle-models")
            return res.data
        }),
    search: (query: VehicleFilterReq) =>
        requestWrapper<VehicleModelViewRes[]>(async () => {
            const params = buildQueryParams(query)

            const res = await axiosInstance.get("/vehicle-models/search", { params })
            return res.data
        }),

    getById: ({ modelId, query }: { modelId: string; query: VehicleFilterReq }) =>
        requestWrapper<VehicleModelViewRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get(`/vehicle-models/${modelId}`, { params })
            return res.data
        })
}
