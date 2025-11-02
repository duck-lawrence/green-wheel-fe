import { UpdateCitizenIdentityReq } from "@/models/citizen-identity/schema/request"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { PaginationParams } from "@/models/common/request"
import { PageResult } from "@/models/common/response"
import { UpdateDriverLicenseReq } from "@/models/driver-license/schema/request"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import {
    CreateUserReq,
    StaffReq,
    UserFilterParams,
    UserUpdateReq
} from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const userApi = {
    getAll: ({ query, pagination }: { query: UserFilterParams; pagination: PaginationParams }) =>
        requestWrapper<PageResult<UserProfileViewRes>>(async () => {
            const params = {
                ...buildQueryParams(query),
                ...buildQueryParams(pagination)
            }
            const res = await axiosInstance.get("/users", { params })
            return res.data
        }),

    getAllStafff: ({ query, pagination }: { query: StaffReq; pagination: PaginationParams }) =>
        requestWrapper<PageResult<UserProfileViewRes>>(async () => {
            const params = {
                ...buildQueryParams(query),
                ...buildQueryParams(pagination)
            }

            const res = await axiosInstance.get("/users/staffs", { params })
            return res.data
        }),

    create: (req: CreateUserReq) =>
        requestWrapper<{ userId: string }>(async () => {
            console.log(req)

            const res = await axiosInstance.post("/users", req)
            return res.data
        }),

    update: ({ id, req }: { id: string; req: UserUpdateReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch(`/users/${id}`, req)
        }),

    deleteById: (userId: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/users/${userId}`)
        }),

    // ========================
    // Citizen Id
    // ========================
    getCitizenIdByUserId: ({ userId }: { userId: string }) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.get(`/users/${userId}/citizen-identity`)
            return res.data
        }),
    uploadCitizenIdById: ({ userId, formData }: { userId: string; formData: FormData }) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.put(`/users/${userId}/citizen-identity`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),
    updateCitizenIdentityById: ({
        userId,
        req
    }: {
        userId: string
        req: UpdateCitizenIdentityReq
    }) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.patch(`/users/${userId}/citizen-identity`, req)
            return res.data
        }),
    deleteCitizenIdentityById: (userId: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/users/${userId}/citizen-identity`)
        }),

    // ========================
    // Driver license
    // ========================
    getDriverLisenseByUserId: ({ userId }: { userId: string }) =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            const res = await axiosInstance.get(`/users/${userId}/driver-license`)
            return res.data
        }),
    uploadDriverLicenseById: ({ userId, formData }: { userId: string; formData: FormData }) =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            // const res = await axiosInstance.put(`/users/${userId}/driver-license`, formData)
            const res = await axiosInstance.put(`/users/${userId}/driver-license`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),
    updateDriverLicenseById: ({ userId, req }: { userId: string; req: UpdateDriverLicenseReq }) =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            const res = await axiosInstance.patch(`/users/${userId}/driver-license`, req)
            return res.data
        }),
    deleteDriverLicenseById: (userId: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/users/${userId}/driver-license`)
        })
}
