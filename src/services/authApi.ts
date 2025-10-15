import { UserChangePasswordReq, UserRegisterCompleteReq } from "@/models/auth/schema/request"
import { TokenRes } from "@/models/auth/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const authApi = {
    login: ({ email, password }: { email: string; password: string }) =>
        requestWrapper<TokenRes>(async () => {
            const res = await axiosInstance.post("/auth/login", { email, password })
            return res.data
        }),
    logout: () =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/auth/logout")
        }),
    loginGoogle: (credential: string) =>
        requestWrapper<TokenRes>(async () => {
            const res = await axiosInstance.post("/auth/google", { credential })
            return res.data
        }),

    // =======================
    // Register
    // =======================
    register: ({ email }: { email: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/auth/register/send-otp", { email })
        }),
    registerVerify: ({ otp, email }: { otp: string; email: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/auth/register/verify-otp", { otp, email })
        }),
    regsiterComplete: (req: UserRegisterCompleteReq) =>
        requestWrapper<TokenRes>(async () => {
            const res = await axiosInstance.post("/auth/register/complete", req)
            return res.data
        }),

    // =======================
    // Password
    // =======================
    changePassword: (req: UserChangePasswordReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put("/auth/change-password", req)
        }),
    forgotPassword: ({ email }: { email: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/auth/forgot-password/send-otp", { email })
        }),
    forgotPasswordVerify: ({ otp, email }: { otp: string; email: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/auth/forgot-password/verify-otp", { otp, email })
        }),
    resetPassword: ({
        newPassword,
        confirmNewPassword
    }: {
        newPassword: string
        confirmNewPassword: string
    }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put("/auth/forgot-password/reset", {
                password: newPassword,
                confirmPassword: confirmNewPassword
            })
        })
}
