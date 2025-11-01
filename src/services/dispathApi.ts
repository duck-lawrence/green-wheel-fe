import {
    CreateDispatchReq,
    DispatchQueryParams,
    UpdateApproveDispatchReq,
    UpdateStatusDispatchReq
} from "@/models/dispatch/schema/request"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const dispatchApi = {
    create: (req: CreateDispatchReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/dispatch-requests", req)
        }),

    approve: ({ id, req }: { id: string; req: UpdateApproveDispatchReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/dispatch-requests/${id}`, req)
        }),

    updateStatus: ({ id, req }: { id: string; req: UpdateStatusDispatchReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/dispatch-requests/${id}/status`, req)
        }),

    getAll: (query: DispatchQueryParams) =>
        requestWrapper<DispatchViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/dispatch-requests", { params })
            return res.data
        }),

    getById: (id: string) =>
        requestWrapper<DispatchViewRes>(async () => {
            const res = await axiosInstance.get(`/dispatch-requests/${id}`)
            return res.data
        })
}
