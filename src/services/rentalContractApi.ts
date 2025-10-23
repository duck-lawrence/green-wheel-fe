import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import {
    ContractQueryParams,
    CreateRentalContractManualReq,
    CreateRentalContractReq,
    HandoverContractReq
} from "@/models/rental-contract/schema/request"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const rentalContractApi = {
    create: (req: CreateRentalContractReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/rental-contracts", req)
        }),

    createManual: (req: CreateRentalContractManualReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/rental-contracts/manual", req)
        }),

    getAll: (query: ContractQueryParams) =>
        requestWrapper<RentalContractViewRes[]>(async () => {
            const params = buildQueryParams(query)

            const res = await axiosInstance.get("/rental-contracts", { params })
            return res.data
        }),

    getMyContract: ({ status }: { status?: RentalContractStatus }) =>
        requestWrapper<RentalContractViewRes[]>(async () => {
            const res = await axiosInstance.get("/rental-contracts/me", { params: { status } })
            return res.data
        }),

    getById: (id: string) =>
        requestWrapper<RentalContractViewRes>(async () => {
            const res = await axiosInstance.get(`/rental-contracts/${id}`)
            return res.data
        }),

    updateContractStatus: ({ id }: { id: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/rental-contracts/${id}`)
        }),

    acceptContract: ({ id }: { id: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/rental-contracts/${id}/accept`)
        }),

    rejectContract: ({ id, vehicalStatus }: { id: string; vehicalStatus: VehicleStatus }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/rental-contracts/${id}/reject`, { vehicalStatus })
        }),

    handover: ({ id, req }: { id: string; req: HandoverContractReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/rental-contracts/${id}/handover`, req)
        }),

    return: ({ id }: { id: string }) =>
        requestWrapper<{ returnInvoiceId: string }>(async () => {
            const res = await axiosInstance.put(`/rental-contracts/${id}/return`)
            return res.data
        }),

    cancel: ({ id }: { id: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/rental-contracts/${id}/cancel`)
        })
}
