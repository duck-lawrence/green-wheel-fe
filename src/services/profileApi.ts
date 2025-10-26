import { useTokenStore } from "@/hooks"
import { UpdateCitizenIdentityReq } from "@/models/citizen-identity/schema/request"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { BackendError } from "@/models/common/response"
import { UpdateDriverLicenseReq } from "@/models/driver-license/schema/request"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { UpdateBankAccountReq, UserUpdateReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"
import axios from "axios"

export const profileApi = {
    // me
    getMe: () =>
        requestWrapper<UserProfileViewRes>(async () => {
            try {
                const res = await axiosInstance.get("/me")
                return res.data
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data
                    const backendError: BackendError = {
                        title: data?.title ?? "Internal Server Error",
                        status: data?.status ?? error.response?.status,
                        detail: data?.detail ?? error.message
                    }

                    if (backendError.status == 404) {
                        useTokenStore.getState().removeAccessToken()
                    }
                    throw backendError
                }
            }
        }),

    updateMe: (req: UserUpdateReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch("/me", req)
        }),

    updateBankAccount: (req: UpdateBankAccountReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put("/me/bank-account", req)
        }),

    deleteBankAccount: () =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete("/me/bank-account")
        }),

    // avatar
    uploadAvatar: (formData: FormData) =>
        requestWrapper<{ avatarUrl: string }>(async () => {
            const res = await axiosInstance.put("/me/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),

    deleteAvatar: () =>
        requestWrapper<{ message: string }>(async () => {
            const res = await axiosInstance.delete("/me/avatar")
            return res.data
        }),

    // citizen identity
    uploadCitizenId: (formData: FormData) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.put("/me/citizen-identity", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),

    getMyCitizenId: () =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.get("/me/citizen-identity")
            return res.data
        }),

    updateCitizenId: (req: UpdateCitizenIdentityReq) =>
        requestWrapper<CitizenIdentityViewRes>(async () => {
            const res = await axiosInstance.patch("/me/citizen-identity", req)
            return res.data
        }),

    deleteCitizenId: () =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete("/me/citizen-identity")
        }),

    // driver license
    uploadDriverLicense: (formData: FormData) =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            const res = await axiosInstance.put("/me/driver-license", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),

    getMyDriverLicense: () =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            const res = await axiosInstance.get("/me/driver-license")
            return res.data
        }),

    updateDriverLicense: (req: UpdateDriverLicenseReq) =>
        requestWrapper<DriverLicenseViewRes>(async () => {
            const res = await axiosInstance.patch("/me/driver-license", req)
            return res.data
        }),

    deleteDriverLicense: () =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete("/me/driver-license")
        })
}
