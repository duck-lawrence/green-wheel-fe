import { UpdateCitizenIdentityReq } from "@/models/citizen-identity/schema/request"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { UpdateDriverLicenseReq } from "@/models/driver-license/schema/request"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { CreateStaffReq, CreateUserReq, UserUpdateReq, UserFilterReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const userApi = {
        getAll: (query: UserFilterReq) =>
        requestWrapper<UserProfileViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/users", { params })
            return res.data
        }),
    create: (req: CreateUserReq) =>
        requestWrapper<{ userId: string }>(async () => {
            const res = await axiosInstance.post("/users", req)
            return res.data
        }),
    createStaff: (req: CreateStaffReq) =>
        requestWrapper<{ userId: string }>(async () => {
            const res = await axiosInstance.post("/users/create-staff", req)
            return res.data
        }),
    update: ({ id, req }: { id: string; req: UserUpdateReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch(`/users/${id}`, req)
        }),
    uploadCitizenIdById: ({ userId, formData }: { userId: string; formData: FormData }) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            // const res = await axiosInstance.put(`/users/${userId}/citizen-identity`, formData)
            // axiosInstance đặt Content-Type mặc định là application/json.
            // Khi upload FormData phải override sang multipart/form-data, nếu không server không nhận file.
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
        }),
    deleteById: (userId: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/users/${userId}`)
        })
}
