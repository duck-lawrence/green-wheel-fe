import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { DispatchQueryParams, UpdateDispatchReq } from "@/models/dispatch/schema/request"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import { dispatchApi } from "@/services/dispathApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
export const useCreateDispatch = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: dispatchApi.create,
        onSuccess: () => {
            toast.success(t("dispatch.create_success"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useUpdateDispatch = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: async ({ id, req }: { id: string; req: UpdateDispatchReq }) => {
            await dispatchApi.update({ id, req })
        },
        onSuccess: () => {
            onSuccess?.()
            toast.success(t("dispatch.update_success"))
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

export const useGetByIdDispatch = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.DISPATCH_REQUESTS, id],
        queryFn: () => dispatchApi.getById(id),
        enabled
    })
    return query
}
