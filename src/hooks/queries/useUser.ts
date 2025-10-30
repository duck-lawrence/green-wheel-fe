"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/queryKey"
import { StaffReq, UserFilterParams, UserUpdateReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { userApi } from "@/services/userApi"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { BackendError, PageResult } from "@/models/common/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { PaginationParams } from "@/models/common/request"

export const useCreateNewUser = ({
    params,
    pagination = {},
    onSuccess,
    onError
}: {
    params: UserFilterParams
    pagination: PaginationParams
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: userApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.USERS, params, pagination] })
            onSuccess?.()
            toast.success(t("success.create"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateUser = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UserUpdateReq }) =>
            requestWrapper(async () => {
                await axiosInstance.patch(`/users/${userId}`, data)
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
            onSuccess?.()
            toast.success(t("success.update"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useGetAllUsers = ({
    params,
    pagination = {},
    enabled = true
}: {
    params: UserFilterParams
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: [...QUERY_KEYS.USERS, params, pagination],
        queryFn: () => userApi.getAll({ query: params, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<UserProfileViewRes>>([
                ...QUERY_KEYS.USERS,
                params,
                pagination
            ])
        },
        enabled
    })
}

export const useGetAllStaffs = ({
    params,
    pagination = {},
    enabled = true
}: {
    params: StaffReq
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: [...QUERY_KEYS.USERS, params, pagination],
        queryFn: () => userApi.getAllStafff({ query: params, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<UserProfileViewRes>>([
                ...QUERY_KEYS.USERS,
                params,
                pagination
            ])
        },
        enabled
    })
    return query
}

export const useDeleteUser = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userApi.deleteById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
            onSuccess?.()
            toast.success(t("success.delete"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

// citizen identity
export const useUploadCitizenIdById = ({
    userId,
    onSuccess,
    onError
}: {
    userId: string
    onSuccess?: (data: CitizenIdentityViewRes) => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            return await userApi.uploadCitizenIdById({ userId, formData })
        },
        onSuccess: (data) => {
            // queryClient.setQueryData<CitizenIdentityViewRes>(
            //     [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY],
            //     (prev) => {
            //         if (!prev) return data
            //         return {
            //             ...prev,
            //             ...data
            //         }
            //     }
            // )
            onSuccess?.(data)
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateCitizenIdById = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userApi.updateCitizenIdentityById,
        onSuccess: () => {
            // queryClient.setQueryData<CitizenIdentityViewRes>(
            //     [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY],
            //     (prev) => {
            //         if (!prev) return data
            //         return {
            //             ...prev,
            //             ...data
            //         }
            //     }
            // )
            onSuccess?.()
            toast.success(t("success.update"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useDeleteCitizenIdById = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userApi.deleteCitizenIdentityById,
        onSuccess: () => {
            // queryClient.removeQueries({
            //     queryKey: [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY]
            // })
            onSuccess?.()
            toast.success(t("success.delete"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

// driver license
export const useUploadDriverLicenseById = ({
    userId,
    onSuccess,
    onError
}: {
    userId: string
    onSuccess?: (data: DriverLicenseViewRes) => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            return await userApi.uploadDriverLicenseById({ userId, formData })
        },
        onSuccess: (data) => {
            // queryClient.setQueryData<DriverLicenseViewRes>(
            //     [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE],
            //     (prev) => {
            //         if (!prev) return data
            //         return {
            //             ...prev,
            //             ...data
            //         }
            //     }
            // )
            onSuccess?.(data)
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateDriverLicenseById = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userApi.updateDriverLicenseById,
        onSuccess: () => {
            // queryClient.setQueryData<DriverLicenseViewRes>(
            //     [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE],
            //     (prev) => {
            //         if (!prev) return data
            //         return {
            //             ...prev,
            //             ...data
            //         }
            //     }
            // )
            onSuccess?.()
            toast.success(t("success.update"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useDeleteDriverLicenseById = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userApi.deleteDriverLicenseById,
        onSuccess: () => {
            // queryClient.removeQueries({
            //     queryKey: [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE]
            // })
            onSuccess?.()
            toast.success(t("success.delete"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
