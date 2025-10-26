import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { DispatchQueryParams, UpdateDispatchReq } from "@/models/dispatch/schema/request"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import { dispatchApi } from "@/services/dispathApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useCreateDispatch = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const router = useRouter()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dispatchApi.create,
        onSuccess: async () => {
            toast.success(t("dispatch.create_success"))
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DISPATCH_REQUESTS })
            router.push("/dashboard/dispatch")
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateDispatch = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        mutationFn: async ({ id, req }: { id: string; req: UpdateDispatchReq }) => {
            await dispatchApi.update({ id, req })
        },
        onSuccess: () => {
            toast.success(t("dispatch.update_success"))
            queryClient.invalidateQueries({
                queryKey: [...QUERY_KEYS.DISPATCH_REQUESTS]
            })
            onSuccess?.()
            router.push("/dashboard/dispatch")
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useGetAllDispatch = ({
    params,
    enabled = true
}: {
    params: DispatchQueryParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.DISPATCH_REQUESTS, params],
        queryFn: () => dispatchApi.getAll(params),
        initialData: () => {
            return queryClient.getQueryData<DispatchViewRes[]>([
                ...QUERY_KEYS.DISPATCH_REQUESTS,
                params
            ])
        },
        enabled
    })
    return query
}

export const useGetDispatchById = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
    // const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.DISPATCH_REQUESTS, id],
        queryFn: () => dispatchApi.getById(id),

        enabled
    })
    return query
}
