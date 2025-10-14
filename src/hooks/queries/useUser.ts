"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/constants/queryKey"
import { UserFilterReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { userApi } from "@/services/userApi"

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
