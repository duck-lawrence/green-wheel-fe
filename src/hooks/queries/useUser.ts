"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/queryKey"
import { UserFilterReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { userApi } from "@/services/userApi"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { BackendError } from "@/models/common/response"

export const useCreateNewUser = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    return useMutation({
        mutationFn: userApi.create,
        onSuccess: () => {
            onSuccess?.()
            toast.success(t("success.create"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useGetAllUsers = ({
    params,
    enabled = true
}: {
    params: UserFilterReq
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: [...QUERY_KEYS.USERS, params],
        queryFn: () => userApi.getAll(params),
        initialData: () => {
            return queryClient.getQueryData<UserProfileViewRes[]>([...QUERY_KEYS.USERS, params])
        },
        enabled
    })
}

// citizen identity
export const useUploadCitizenIdById = ({
    userId,
    onSuccess,
    onError
}: {
    userId: string
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            return await userApi.uploadCitizenIdById({ userId, formData })
        },
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
    onSuccess?: () => void
    onError?: () => void
}) => {
    const { t } = useTranslation()
    // const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            return await userApi.uploadDriverLicenseById({ userId, formData })
        },
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
            toast.success(t("success.upload"))
        },
        onError: (error: BackendError) => {
            onError?.()
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateDriverLicense = ({
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

export const useDeleteDriverLicense = ({
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
