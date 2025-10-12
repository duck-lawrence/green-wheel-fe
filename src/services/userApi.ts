import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { CreateUserReq, UserFilterReq } from "@/models/user/schema/request"
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

    createAnonymousAccount: (req: CreateUserReq) =>
        requestWrapper<{ userId: string }>(async () => {
            const res = await axiosInstance.post("/users/anonymous", req)
            return res.data
        }),

    uploadCitizenIdForAnonymous: ({ userId, formData }: { userId: string; formData: FormData }) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.post(`/users/${userId}/citizen-identity`, formData)
            return res.data
        }),

    uploadDriverLicenseForAnonymous: ({
        userId,
        formData
    }: {
        userId: string
        formData: FormData
    }) =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            const res = await axiosInstance.post(`/users/${userId}/driver-license`, formData)
            return res.data
        })
}
