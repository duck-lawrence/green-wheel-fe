import { UserUpdateReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const profileApi = {
    getMe: () =>
        requestWrapper<UserProfileViewRes>(async () => {
            const res = await axiosInstance.get("/users/me")
            return res.data
        }),

    updateMe: (req: UserUpdateReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch("/users/me", req)
        }),

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
        })
}
