import { CitizenIdentityRes } from "@/models/citizen-identity/schema/response"
import { DriverLicenseRes } from "@/models/driver-license/schema/response"
import { UserUpdateReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const profileApi = {
    // me
    getMe: () =>
        requestWrapper<UserProfileViewRes>(async () => {
            const res = await axiosInstance.get("/users/me")
            return res.data
        }),

    updateMe: (req: UserUpdateReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch("/users/me", req)
        }),

    // avatar
    uploadAvatar: (formData: FormData) =>
        requestWrapper<{ avatarUrl: string }>(async () => {
            const res = await axiosInstance.put("/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),

    deleteAvatar: () =>
        requestWrapper<{ message: string }>(async () => {
            const res = await axiosInstance.delete("/users/avatar")
            return res.data
        }),

    // citizen identity
    uploadCitizenId: (formData: FormData) =>
        requestWrapper<CitizenIdentityRes>(async () => {
            const res = await axiosInstance.post("/users/citizen-identity", formData)
            return res.data
        }),

    getMyCitizenId: () =>
        requestWrapper<CitizenIdentityRes>(async () => {
            const res = await axiosInstance.get("/users/citizen-identity")
            return res.data
        }),

    // driver license
    uploadDriverLicense: (formData: FormData) =>
        requestWrapper<DriverLicenseRes>(async () => {
            const res = await axiosInstance.post("/users/citizen-identity", formData)
            return res.data
        }),

    getMyDriverLicense: () =>
        requestWrapper<DriverLicenseRes>(async () => {
            const res = await axiosInstance.get("/users/citizen-identity")
            return res.data
        })
}
