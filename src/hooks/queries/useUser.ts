"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

import { QUERY_KEYS } from "@/constants/queryKey"
import { UserFilterReq, UserUpdateReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { userApi } from "@/services/userApi"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

export const useSearchUsers = ({
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
            return queryClient.getQueryData<UserProfileViewRes[]>([
                ...QUERY_KEYS.USERS,
                params
            ])
        },
        enabled
    })
}

export const useUpdateUser = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UserUpdateReq }) =>
            userApi.update({ userId, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
            toast.success(t("success.update"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
